const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/dashboard');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && !f.includes('Card') && !f.includes('Header') && !f.includes('Settings'));

for (const f of files) {
  const filepath = path.join(dir, f);
  if (!fs.existsSync(filepath)) continue;
  
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (!content.includes('S/ {') && !content.includes('S/ {')) {
    continue;
  }
  
  // Replace S/ {x.toFixed(2)} with {formatCurrency(x)}
  content = content.replace(/S\/ \{([^}]+?)\.toFixed\(\d+\)\}/g, '{formatCurrency($1)}');
  content = content.replace(/S\/ \{([^}]+?)\}/g, '{formatCurrency($1)}');
  
  // Inject useCurrency
  if (!content.includes('useCurrency')) {
    const importMatch = content.match(/import .* from .*/g);
    const lastImport = importMatch ? importMatch[importMatch.length - 1] : '';
    let importPath = '../../contexts/CurrencyContext';
    
    content = content.replace(lastImport, `${lastImport}\nimport { useCurrency } from "${importPath}";`);
    
    // Inject const { formatCurrency } = useCurrency();
    const componentRegex = /(export default function [a-zA-Z0-9_]+\([^)]*\)\s*\{)/;
    if (componentRegex.test(content)) {
      content = content.replace(componentRegex, `$1\n  const { formatCurrency } = useCurrency();\n`);
    } else {
        // sometimes there is no space
        const c2 = /(export default function [a-zA-Z0-9_]+\([^)]*\)\{)/;
        content = content.replace(c2, `$1 const { formatCurrency } = useCurrency(); `);
    }
  }
  
  fs.writeFileSync(filepath, content);
  console.log('Updated ' + f);
}
