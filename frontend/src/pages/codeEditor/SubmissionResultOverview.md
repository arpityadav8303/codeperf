# Submission Result View Overview

## Goal
Build the single submission result experience that appears after a benchmark finishes.

## Page
- Route: /submissions/:id
- Purpose: show the completed analysis result for one submission

## Main UI Blocks
1. Header
   - submission id
   - status badge
   - language
   - submitted time

2. Summary Cards
   - detected complexity
   - confidence score
   - benchmark summary

3. Chart Area
   - line chart for input size vs execution time
   - log-scale x-axis
   - hover tooltip with readable values

4. Complexity Badge
   - visual badge for O(n), O(n log n), or O(n^2)
   - reused in the history list later

5. Empty/Loading/Error States
   - loading skeleton while data is being fetched
   - empty fallback if no result exists yet
   - error state if the request fails

## Data Needed
- submission details
- benchmark results
- detected complexity
- confidence

## Notes for Implementation
- This page should be built as the completed-state version of the submission detail experience.
- The chart should be reusable and easy to plug into later dashboard views.
- Keep the initial version simple and visual, not overly complex.
