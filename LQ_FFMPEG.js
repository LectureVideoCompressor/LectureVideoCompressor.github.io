const compressedMp4PostfixAdder = function(fileName){
  return fileName.replace(/\.[^/.]+$/, "(c).mp4")
}

const transcode_lq = async ({ target: { files }  }) => {
  const message = document.getElementById('message_lq');
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
  },
  });
  const { name } = files[0];
  const outputName=compressedMp4PostfixAdder(name);
  message.innerHTML = 'Loading ffmpeg-core.js';
  await ffmpeg.load();
  message.innerHTML = 'Start transcoding';
  ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
  await ffmpeg.run('-i', name, "-crf", "28", "-r", "24", "-ac", "1", "-q:a", "0.85", outputName); 
  message.innerHTML = 'Complete transcoding';
  const data = ffmpeg.FS('readFile', outputName);  
  const src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  
  document.getElementById("download_button_lq").style.display = "block";
  document.getElementById("download_button_lq").download = outputName;
  document.getElementById("download_button_lq").href=src;
}
document.getElementById('uploader_lq').addEventListener('change', transcode_lq);