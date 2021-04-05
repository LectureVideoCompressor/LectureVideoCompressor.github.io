const { createFFmpeg, fetchFile } = FFmpeg;
              const ffmpeg = createFFmpeg({ log: true });
              const transcode = async ({ target: { files } }) => {
                const { name } = files[0];
                await ffmpeg.load();
                ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
                await ffmpeg.run('-i', name,'-crf','28','-r','24','-ac','1','-q:a','0.85','output.mp4');
                const data = ffmpeg.FS('readFile', 'output.mp4');
                const video = document.getElementById('player');
                video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
              }
              document.getElementById('uploader').addEventListener('change', transcode);