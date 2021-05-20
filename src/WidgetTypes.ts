interface GeneralConfig {
    content: string;
    icon: string;
}

class DefWidget extends Widget {
    constructor(config: { word: string; definition: string; icon: string; partOfSpeech?: string } | GeneralConfig) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            let text: string = `<h5 class='p-0 m-0 noselect'>${config.word} ${
                config.partOfSpeech != undefined ? `(${config.partOfSpeech})` : ""
            }</h5><hr class='mb-2 mt-1'>${config.definition}`;
            super({ content: text, icon: config.icon });
        }
    }
}

class CommentWidget extends Widget {
    constructor(config: { icon: string } | GeneralConfig) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            let div =
                "<h5 class='p-0 m-0 noselect'>Comment</h5><hr class='mb-2 mt-1'><div contenteditable='plaintext-only' class='my-1 outline-0 border-0' />";
            super({ content: div, icon: config.icon });
        }

        let ele = this.element.querySelector("div.widgetContent > div[contenteditable='plaintext-only']")!;

        if (ele.innerHTML == "") ele.classList.add("editable-div");

        ele.addEventListener("input", (e) => {
            const value = ele.innerHTML;
            if (value == "" || value == "<br>") ele.classList.add("editable-div");
            else ele.classList.remove("editable-div");
        });
    }
}

class YoutubeWidget extends Widget {
    constructor(config: { url?: string; icon: string } | GeneralConfig) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            if (config.url != undefined) {
                let width = 300 - 16,
                    params = new URLSearchParams(config.url.substring(config.url.indexOf("?")));

                let content = `<iframe width="${width}" height="${width * (9 / 16)}" src="https://www.youtube.com/embed/${params.get(
                    "v"
                )}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                super({ content: content, icon: config.icon });
            } else {
                let content = ` <div class="form-group">
                                    <label for="utubeurl">Youtube URL</label>
                                    <input type="text" class="form-control" id="utubeurl" placeholder="https://www.youtube.com/watch?v=...">
                                </div>
                                <button role="button" class="btn btn-primary" id="getUtube">Get</button>`;
                super({ content: content, icon: config.icon });
            }
        }
        if (this.element.querySelector("button#getUtube") != null) {
            console.log("listener made");
            (<HTMLButtonElement>this.element.querySelector("button#getUtube")!).onclick = (e) => {
                console.log("we are in");
                e.preventDefault();
                let url = (<HTMLInputElement>this.element.querySelector("div.form-group > input#utubeurl")!).value;
                new YoutubeWidget({ url: url, icon: config.icon });
                this.delete();
            };
        }
    }
}

class RecordWidget extends Widget {
    constructor(config: { icon: string } | GeneralConfig) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            let content = ` <button id="recordButton" class="btn m-0 p-0 d-flex d-inline-flex" type="button" role="button">
                                <i class="far fa-microphone fa-2x"></i>
                            </button>
                            <button id="playButton" class="btn m-0 p-0 d-flex d-inline-flex flex-row d-none" type="button" role="button">
                                <i class="far fa-play-circle fa-2x d-flex flex-column"></i>
                                <i class="far fa-pause-circle fa-2x d-none d-flex flex-column"></i>
                            </button>
                            <div id="storage" class="d-flex d-inline-flex"></div>`;
            super({ content: content, icon: config.icon });
        }
        let recording = false;
        let recorder: any = null;
        // TODO load audio from data-audio
        let audio: { audioBlob: Blob; audioUrl: string; audio: HTMLAudioElement; play: () => void; pause: () => void } | null = null;
        (this.element.querySelector("button#recordButton") as HTMLButtonElement).onclick = (e) => {
            if (!recording) {
                recording = true;
                RecordWidget.startRecord().then((res) => {
                    recorder = res;
                });
            } else {
                recording = false;
                RecordWidget.stopRecord(recorder).then((res) => {
                    audio = res;
                    let reader = new FileReader();
                    reader.readAsDataURL(audio?.audioBlob!);
                    reader.onloadend = () => {
                        let base64 = reader.result;
                        base64 = (base64 as string).split(",")[1];
                        this.element.querySelector("div#storage")?.setAttribute("data-audio", base64);
                    };
                    this.element.querySelector("button#recordButton")?.classList.add("d-none");
                    this.element.querySelector("button#playButton")?.classList.remove("d-none");
                });
            }
        };
        (this.element.querySelector("button#playButton") as HTMLButtonElement).onclick = (e) => {
            if (!this.element.querySelector("button#playButton > i.fa-play-circle")?.classList.contains("d-none")) {
                this.element.querySelector("button#playButton > i.fa-play-circle")?.classList.add("d-none");
                this.element.querySelector("button#playButton > i.fa-pause-circle")?.classList.remove("d-none");
                audio!.play();
                audio!.audio.addEventListener("ended", () => {
                    this.element.querySelector("button#playButton > i.fa-play-circle")?.classList.remove("d-none");
                    this.element.querySelector("button#playButton > i.fa-pause-circle")?.classList.add("d-none");
                });
            } else {
                this.element.querySelector("button#playButton > i.fa-play-circle")?.classList.remove("d-none");
                this.element.querySelector("button#playButton > i.fa-pause-circle")?.classList.add("d-none");
                audio!.pause();
            }
        };
    }

    static sleep(time: number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    static record(): Promise<{ start: any; stop: any }> {
        return new Promise((resolve) => {
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                const audioChunks: Blob[] = [];

                mediaRecorder.addEventListener("dataavailable", (event) => {
                    audioChunks.push(event.data);
                });

                const start = () => {
                    mediaRecorder.start();
                };

                const stop = () => {
                    return new Promise((resolve) => {
                        mediaRecorder.addEventListener("stop", () => {
                            const audioBlob = new Blob(audioChunks);
                            const audioUrl = URL.createObjectURL(audioBlob);
                            const audio = new Audio(audioUrl);
                            const play = () => {
                                audio.play();
                            };
                            const pause = () => {
                                audio.pause();
                            };

                            resolve({ audioBlob, audioUrl, audio, play, pause });
                        });

                        mediaRecorder.stop();
                    });
                };

                resolve({ start, stop });
            });
        });
    }

    static async startRecord() {
        const recorder = await RecordWidget.record();
        recorder.start();
        return new Promise((resolve) => {
            resolve(recorder);
        });
    }

    static async stopRecord(recorder: { start: any; stop: any }): Promise<any> {
        const audio = await recorder.stop();
        return new Promise((resolve) => {
            resolve(audio);
        });
    }
}

function isGeneralConfig(config: object | GeneralConfig): config is GeneralConfig {
    return (config as GeneralConfig).content != undefined;
}
