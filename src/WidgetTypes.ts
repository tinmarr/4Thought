interface GeneralConfig {
    content: string;
    collapse: string | boolean;
}

class DefWidget extends Widget {
    constructor(config: { word: string; definition: string; partOfSpeech?: string } | GeneralConfig) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            const content: string = `<h5 class='p-0 m-0 noselect'>${config.word} ${
                config.partOfSpeech != undefined ? `(${config.partOfSpeech})` : ""
            }</h5><hr class='mb-2 mt-1'>${config.definition}`;
            const collapse = false;
            super({ content: content, collapse: collapse });
        }
    }
}

class CommentWidget extends Widget {
    constructor(config: {} | GeneralConfig = {}) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            const content =
                "<h5 class='p-0 m-0 noselect'>Comment</h5><hr class='mb-2 mt-1'><div contenteditable='plaintext-only' class='my-1 outline-0 border-0' />";
            const collapse = false;
            super({ content: content, collapse: collapse });
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
    constructor(config: { url?: string } | GeneralConfig = {}) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            if (config.url != undefined) {
                const width = 300 - 16,
                    params = new URLSearchParams(config.url.substring(config.url.indexOf("?")));

                const content = `<iframe width="${width}" height="${width * (9 / 16)}" src="https://www.youtube.com/embed/${params.get(
                    "v"
                )}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                const collapse = false;
                super({ content: content, collapse: collapse });
            } else {
                const content = ` <div class="form-group">
                                    <label for="utubeurl">Youtube URL</label>
                                    <input type="text" class="form-control" id="utubeurl" placeholder="https://www.youtube.com/watch?v=...">
                                </div>
                                <button role="button" class="btn btn-primary" id="getUtube">Get</button>`;
                const collapse = false;
                super({ content: content, collapse: collapse });
            }
        }
        if (this.element.querySelector("button#getUtube") != null) {
            console.log("listener made");
            (<HTMLButtonElement>this.element.querySelector("button#getUtube")!).onclick = (e) => {
                console.log("we are in");
                e.preventDefault();
                let url = (<HTMLInputElement>this.element.querySelector("div.form-group > input#utubeurl")!).value;
                new YoutubeWidget({ url: url });
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
            const content = ` <button id="recordButton" class="btn m-0 p-0 d-flex d-inline-flex" type="button" role="button">
                                <i class="far fa-microphone fa-2x"></i>
                            </button>
                            <button id="playButton" class="btn m-0 p-0 d-flex d-inline-flex flex-row d-none" type="button" role="button">
                                <i class="far fa-play-circle fa-2x d-flex flex-column"></i>
                            </button>
                            <div id="storage" class="d-flex d-inline-flex d-none"></div>`;
            const collapse = false;
            super({ content: content, collapse: collapse });
        }
        let recording = false;
        let recorder: any = null;

        let base64 = (this.element.querySelector("div#storage")?.getAttribute("data-audio") as string) || "";
        if (base64 != "") {
            let base64response = fetch(base64).then((res) => {
                res.blob().then((blob) => {
                    audio = RecordWidget.makeOthers(blob);
                });
            });
            this.element.querySelector("button#playButton > i.far")?.classList.add("fa-play-circle");
            this.element.querySelector("button#playButton > i.far")?.classList.remove("fa-pause-circle");
        }

        let audio: { audioBlob: Blob; audioUrl: string; audio: HTMLAudioElement; play: () => void; pause: () => void } | null = null;
        (this.element.querySelector("button#recordButton") as HTMLButtonElement).onclick = (e) => {
            this.element.querySelector("button#recordButton > i.fa-microphone")?.classList.remove("far");
            this.element.querySelector("button#recordButton > i.fa-microphone")?.classList.add("fas");
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
                        base64 = reader.result as string;
                        this.element.querySelector("div#storage")?.setAttribute("data-audio", base64);
                    };
                    this.element.querySelector("button#recordButton")?.classList.add("d-none");
                    this.element.querySelector("button#playButton")?.classList.remove("d-none");
                });
            }
        };
        (this.element.querySelector("button#playButton") as HTMLButtonElement).onclick = (e) => {
            if (this.element.querySelector("button#playButton > i.far")?.classList.contains("fa-play-circle")) {
                this.element.querySelector("button#playButton > i.far")?.classList.remove("fa-play-circle");
                this.element.querySelector("button#playButton > i.far")?.classList.add("fa-pause-circle");
                audio!.play();
                audio!.audio.addEventListener("ended", () => {
                    this.element.querySelector("button#playButton > i.far")?.classList.add("fa-play-circle");
                    this.element.querySelector("button#playButton > i.far")?.classList.remove("fa-pause-circle");
                });
            } else {
                this.element.querySelector("button#playButton > i.far")?.classList.add("fa-play-circle");
                this.element.querySelector("button#playButton > i.far")?.classList.remove("fa-pause-circle");
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
                window.streamReference = stream;
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

                            resolve(RecordWidget.makeOthers(audioBlob));
                        });

                        mediaRecorder.stop();

                        console.log(window.streamReference);
                        if (!window.streamReference) return;

                        window.streamReference.getAudioTracks().forEach(function (track) {
                            track.stop();
                        });

                        window.streamReference.getVideoTracks().forEach(function (track) {
                            track.stop();
                        });

                        window.streamReference = null;
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

    static makeOthers(blob: Blob): { audioBlob: Blob; audioUrl: string; audio: HTMLAudioElement; play: () => void; pause: () => void } {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        const play = () => {
            audio.play();
        };
        const pause = () => {
            audio.pause();
        };
        return { audioBlob: blob, audioUrl: audioUrl, audio: audio, play: play, pause: pause };
    }
}

function isGeneralConfig(config: object | GeneralConfig): config is GeneralConfig {
    return (config as GeneralConfig).content != undefined;
}
