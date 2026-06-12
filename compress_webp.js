const fs = require('fs');

async function main() {
  try {
    const sharp = require('sharp');
    const inputBuffer = fs.readFileSync('./public/assets/bg.webp');
    console.log('Original size:', inputBuffer.length);
    
    // sharp handles animated WebP when options are provided
    const data = await sharp(inputBuffer, { animated: true })
      .webp({ quality: 50, reductionEffort: 6, smartSubsample: true })
      .toBuffer();
      
    console.log('Compressed size:', data.length);
    
    // Before overwriting, let's just make sure it worked and size is smaller
    if (data.length < inputBuffer.length) {
      fs.writeFileSync('./public/assets/bg-opt.webp', data);
      console.log('Successfully saved to bg-opt.webp');
    } else {
      console.log('Compression did not reduce size.');
    }
  } catch(e) {
    console.error('Error starting sharp:', e.message);
    if(e.message.includes('Cannot find module')) {
       console.log('We should run: npm install sharp --no-save');
    }
  }
}

main();
