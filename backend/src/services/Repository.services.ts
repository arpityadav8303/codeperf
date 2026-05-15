import { GitRepos } from "../repositiory/GitRepository.repo";
import { SelectQueryBuilder, Brackets } from "typeorm";

type JoinMethod = 'leftJoinAndSelect' | 'innerJoinAndSelect' | 'leftJoin' | 'innerJoin';

export type WhereCondition = {
    name: string;
    op: 'is' | '!=' | 'like' | 'in' | 'isNUll' | 'notNUll' | 'gt' | 'lt';
    value: any;
};

type SortCondition = {
    field: string;
    direction: 'ASC' | 'DESC';
};

type relations = {
    name: string;
    alias: string;
    JoinType?: string;
    condition?: string
};

type Search = {
    name: string;
    op: string;
    value: string;
}
import crypto from 'crypto'
export class repositioryService {
    constructor(
        private gitrepo = GitRepos,
    ) { }

    async connect(userId: string, dto: any): Promise<any> {
        const existing = await this.gitrepo.findOne({
            where: {
                githubRepoId: dto.githubRepoId,
                user: { id: userId }
            }
        });
        if (existing) {
            throw new Error("Repository is already connected to an account.");
        }
        const webhookSecret = crypto.randomBytes(32).toString('hex');
        const newRepo = this.gitrepo.create({
            ...dto,
            webhookSecret,
            user: { id: userId }
        })

        return await this.gitrepo.save(newRepo);

    }

    async list(limit: number, offset: number, select: string[] = [], whereCondition: WhereCondition[] = [], relations: relations[] = [], sort: SortCondition[] = [], search: Search[] = []): Promise<any> {
        const query = this.gitrepo.createQueryBuilder("repository");

        if (select.length > 0) {
            const prefixSelect = select.map(col =>
                col.includes('.') ? col : `repository.${col}`
            );
            query.select(prefixSelect);
        }

        if (relations.length > 0) {
            relations.forEach(rel => {
                const method = (rel.JoinType ?? 'leftJoinAndSelect') as JoinMethod;
                const path = rel.name.includes('.') ? rel.name : `repository.${rel.name}`;
                (query[method] as Function)(path, rel.alias, rel.condition || undefined);
            });
        }

        if (whereCondition.length > 0) {
            whereCondition.forEach((cond, index) => {
                const paramName = `p${index}`;
                const field = cond.name.includes('.') ? cond.name : `repository.${cond.name}`;

                const op = cond.op.toLowerCase();

                if (op === 'is' || op === '=') {
                    query.andWhere(`${field} = :${paramName}`, { [paramName]: cond.value });
                } else if (op === '!=') {
                    query.andWhere(`${field} != :${paramName}`, { [paramName]: cond.value });
                } else if (op === 'like') {
                    query.andWhere(`${field} LIKE :${paramName}`, { [paramName]: `%${cond.value}%` });
                } else if (op === 'in') {
                    query.andWhere(`${field} IN (:...${paramName})`, { [paramName]: cond.value });
                } else if (op === 'isnull') {
                    query.andWhere(`${field} IS NULL`);
                } else if (op === 'notnull') {
                    query.andWhere(`${field} IS NOT NULL`);
                } else if (op === 'gt') {
                    query.andWhere(`${field} > :${paramName}`, { [paramName]: cond.value });
                } else if (op === 'lt') {
                    query.andWhere(`${field} < :${paramName}`, { [paramName]: cond.value });
                }
            });
        }

        if (sort.length > 0) {
            sort.forEach(s => {
                const field = s.field.includes('.') ? s.field : `repository.${s.field}`;
                query.addOrderBy(field, s.direction);
            });
        }

        if (search) {
            const likeConditions = search.filter(item => item.op === 'like');
            if (likeConditions.length > 0) {
                query.andWhere(
                    new Brackets((qb) => {
                        likeConditions.forEach((item, idx) => {
                            const { name, value } = item;
                            const column = `repositiory.${name}`;
                            const paramKey = `${name}_like_${idx}`;
                            const clause = `${column} LIKE :${paramKey}`;
                            if (idx === 0) {
                                qb.where(clause, { [paramKey]: `%${value}%` });
                            } else {
                                qb.orWhere(clause, { [paramKey]: `%${value}%` });
                            }

                        });

                    })
                );
            }
            likeConditions.forEach((item) => {
                const { name, value } = item;
                const column = name.includes('.') ? name : `repository.${name}`;

                // We use addOrderBy to prioritize these relevance rules before any user-defined sorts
                query.addOrderBy(`
                CASE 
                    WHEN ${column} LIKE '${value}%' THEN 1 
                    WHEN ${column} LIKE '%${value}%' THEN 2 
                    ELSE 3 
                END
            `, 'ASC');
            });
        }

        const [data, total] = await query
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return {
            success: true,
            data,
            meta: {
                total,
                limit,
                offset,
                totalPages: Math.ceil(total / limit),
                currentPage: Math.floor(offset / limit) + 1
            }
        };
    }
}
