#! /bin/bash
set -e
set -x

echo "Please build cashflow-www manually and re-run this"

LAST_COMMIT=$(git rev-parse HEAD)

cp config.js ../web/.
(cd ../api; npm update)

(cd ..;
  docker build -t quay.io/buildo/cashflow:$LAST_COMMIT .;
  docker tag -f quay.io/buildo/cashflow:$LAST_COMMIT quay.io/buildo/cashflow:latest;

  docker push quay.io/buildo/cashflow:$LAST_COMMIT;
  docker push quay.io/buildo/cashflow:latest
)
