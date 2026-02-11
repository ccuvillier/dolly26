// scripts/generateData.cjs
const fs = require("fs");
const path = require("path");

/**
 * Génère un fichier data pour composants JSX (bas, hauts, cheveux)
 */
function generateComponentData({ imagesFolder, outputFile, exportName }) {
  const files = fs.existsSync(imagesFolder)
    ? fs.readdirSync(imagesFolder).filter(f => f.endsWith(".jsx"))
    : [];

  const imports = files.map(f => {
    const rawName = path.basename(f, ".jsx");
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const relativePath = path.relative(path.dirname(outputFile), path.join(imagesFolder, f)).replace(/\\/g, "/");
    return `import ${name} from "${relativePath}";`;
  }).join("\n");

  const arrayItems = files.map(f => {
    const rawName = path.basename(f, ".jsx");
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    return `  { name: "${name}", component: ${name} }`;
  });

  const content = `
${imports}

export const ${exportName} = [
${arrayItems.join(",\n")}
];
`;

  fs.writeFileSync(outputFile, content, "utf8");
  console.log(`Component data generated: ${outputFile}`);
}

/**
 * Génère un fichier data pour tissus (images webp/jpg/png)
 * - Le tissu "uni" est ajouté automatiquement
 * - Chaque fichier du dossier devient un objet {name,label,isUni,preview}
 */
function generateTissusData({ imagesFolder, outputFile }) {
  const fs = require("fs");
  const path = require("path");

  const files = fs.existsSync(imagesFolder)
    ? fs.readdirSync(imagesFolder).filter(f =>
        f.endsWith(".webp") || f.endsWith(".jpg") || f.endsWith(".png")
      )
    : [];

  // Commence par le tissu "uni"
  const items = [
    { name: "uni", label: "Uni", isUni: true, preview: null }
  ];

  // Générer les imports et les items
  const imports = files.map(f => {
    const rawName = path.basename(f, path.extname(f)); // tissuAntillais
    const varName = rawName; // on garde exact pour l'import (minuscule)

    const relativePath = path
      .relative(path.dirname(outputFile), path.join(imagesFolder, f))
      .replace(/\\/g, "/");

    // Générer l'item
    const name = rawName.startsWith("tissu") ? rawName.slice(5).toLowerCase() : rawName.toLowerCase();
    const labelBase = rawName.startsWith("tissu") ? rawName.slice(5) : rawName;
    const label = labelBase.charAt(0).toUpperCase() + labelBase.slice(1);

    items.push({
      name,
      label,
      isUni: false,
      preview: varName
    });

    return `import ${varName} from "${relativePath}";`;
  });

  // Générer le contenu final
  const content = `
${imports.join("\n")}

export const tissus = [
${items.map(i => `  { name: "${i.name}", label: "${i.label}", isUni: ${i.isUni}, preview: ${i.preview} }`).join(",\n")}
];
`;

  fs.writeFileSync(outputFile, content, "utf8");
  console.log(`Tissus data generated: ${outputFile}`);
}

// -------------------------------
// EXÉCUTION

// Bas
generateComponentData({
  imagesFolder: path.join(__dirname, "../src/components/images/bas"),
  outputFile: path.join(__dirname, "../src/components/carousels/data/bassData.js"),
  exportName: "bass"
});

// Hauts
generateComponentData({
  imagesFolder: path.join(__dirname, "../src/components/images/hauts"),
  outputFile: path.join(__dirname, "../src/components/carousels/data/hautsData.js"),
  exportName: "hauts"
});

// Cheveux
generateComponentData({
  imagesFolder: path.join(__dirname, "../src/components/images/cheveux"),
  outputFile: path.join(__dirname, "../src/components/carousels/data/coiffuresData.js"),
  exportName: "hairs"
});

// Tissus
generateTissusData({
  imagesFolder: path.join(__dirname, "../src/components/images/tissus"),
  outputFile: path.join(__dirname, "../src/components/paletteTissus/data/tissusData.js")
});
