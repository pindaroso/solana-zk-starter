#!/bin/bash

rm -rf packages/app/src/idl
rm -rf packages/app/src/types/protocol.ts
cp -r packages/protocol/target/idl packages/app/src/idl
cp -r packages/protocol/target/types/protocol.ts packages/app/src/types/protocol.ts
