# It Works on My Machine

A lightweight Node.js app with Express, designed to demonstrate CI/CD pipelines.

---

My CI/CD approch:
1. whenever a developer pushes to his remote working branch (i.e. feture/**) a static code analysis pipeline starts running (static-code-analysis.yml):
  - linters (Prettier and ESlint)
  - security scans for vulnerabilities (Snyk, could be also Sonatype, lifecycle etc.)
  - unit tests
  - this is happening for every push, in order to detect code issues in an early phase and to lighten burden on the long PR pipeline (also, this checks are not env related).
2. once a merge request is created, a full pipeline starts (pr-qa-stg.yml):
  - build QA enviroment (currently doesn't really do anything, in real life will have other steps or can be removed)
  - tag the commit and deploy to QA (in real life will include pushing image to remore repository, deploying to EKS etc.)
  - run sanity after deployment - currently only using the /health endpoint, in reallife should include more tests.
  - if sanity passed, run (in parallel) funcational + integration tests (can add or remove tests, like component, depands on service/project needs)
  - if any of the 3 previous test suites fails - rollback the image in QA and pipeline stops with failure
  - if all tests passed in QA - add a 'qa-stable' tag and continue to STG
  - build STG
  - tag and deploy STG
  - run sanity tests in STG (currently only /health endpoint, will be different in real life)
  - if STG sanity passed, run in parallel - e2e, regression and performance (can add more test suites, and changed to run sequentially if it might interfere with one another)
  - if any of the previous test suites fails - rollback the image in STG and pipeline stops with failure
  - if all tests passed - add a 'stg-stable' tag
  - slack notifications only on failures (silent slack channel to prevent noise of messages)
3. only after the pipeline finished with sucess, the reviewer can merge the PR (checks prevent push if any of the requeired steps failed)
4. when merge request is approved and merged, a second pipeline starts (pr-prod.yml):
  - 
