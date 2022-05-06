#! /bin/sh
#! chmod +x cti.sh
#! -- -i '*spec.ts' -b not add for test files and -b to ignore backup files

npm run cti create './src/shared/application' -- -i '*spec.ts' -b && 
npm run cti create './src/shared/domain' -- -i '*spec.ts' -b && 
npm run cti create './src/shared/infra' -- -i '*spec.ts' -b && 

npm run cti create './src/category/application' -- -i '*spec.ts' -b && 
npm run cti create './src/category/domain' -- -i '*spec.ts' -b && 
npm run cti create './src/category/infra' -- -i '*spec.ts' -b