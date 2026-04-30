const fs = require("fs");
const path = require("path");
const solc = require("solc");

const contractsDir = path.resolve(__dirname, "contracts");
const contractFiles = fs
  .readdirSync(contractsDir)
  .filter((f) => f.endsWith(".sol"));

const sources = {};
contractFiles.forEach((file) => {
  const filePath = path.resolve(contractsDir, file);
  sources[file] = { content: fs.readFileSync(filePath, "utf8") };
});

const input = {
  language: "Solidity",
  sources: sources,
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

function findImports(importPath) {
  if (importPath.startsWith("@openzeppelin/")) {
    const fullPath = path.resolve(__dirname, "node_modules", importPath);
    return { contents: fs.readFileSync(fullPath, "utf8") };
  }
  return { error: "File not found" };
}

console.log("Compiling contracts...");
const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports }),
);

if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
  if (output.errors.some((err) => err.severity === "error")) {
    process.exit(1);
  }
}

if (!fs.existsSync("artifacts")) {
  fs.mkdirSync("artifacts");
}

for (const fileName in output.contracts) {
  for (const contractName in output.contracts[fileName]) {
    const contract = output.contracts[fileName][contractName];
    const artifact = {
      abi: contract.abi,
      bytecode: contract.evm.bytecode.object,
    };

    fs.writeFileSync(
      path.resolve(__dirname, "artifacts", `${contractName}.json`),
      JSON.stringify(artifact, null, 2),
    );
    console.log(`Saved artifact for ${contractName}`);
  }
}

console.log("Compilation successful!");
