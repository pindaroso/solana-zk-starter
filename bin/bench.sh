#!/bin/bash

echo "benchmark program"
echo "size: $(ls -l packages/protocol/target/deploy/benchmark.so | awk '{printf "%.2f", $5/1048576}') MB"
echo "$(stat -f %z packages/protocol/target/deploy/benchmark.so | xargs solana --url=https://api.mainnet-beta.solana.com rent)"

echo "program"
echo "size: $(ls -l packages/protocol/target/deploy/protocol.so | awk '{printf "%.2f", $5/1048576}') MB"
echo "$(stat -f %z packages/protocol/target/deploy/protocol.so | xargs solana --url=https://api.mainnet-beta.solana.com rent)"
