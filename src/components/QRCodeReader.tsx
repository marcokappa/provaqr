"use client"; // This is a client component
import {useEffect, useState} from "react";
import {QrReader} from "react-qr-reader";
import {isMobile,} from "react-device-detect";

const QRCodeReader: React.FC = () => {
    const [selected, setSelected] = useState(isMobile ? "environment" : "user");
    const [queryString, setQueryString] = useState("");
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);

    const [mediaDeviceVideos, setMediaDeviceVideos] = useState<MediaDeviceInfo[]>([]);
    const [device, setDevice] = useState<MediaDeviceInfo>();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    function getString(url: string): string {
        const PATH_TO_MATCH = "stringaPaziente=";
        if (!url) {
            throw "url non valido";
        }

        let pos = url.indexOf("stringaPaziente=");
        let ret = url.substring(pos + PATH_TO_MATCH.length, url.length);

        return ret;
    }

    const loadCamera = () => {
        navigator.mediaDevices.enumerateDevices().then(
            (mediaStream) => {

                let mediaDeviceVideos = mediaStream.filter(el => {
                    return el.kind == "videoinput"
                })
                if (mediaDeviceVideos.length > 0) {

                    setMediaDeviceVideos(mediaDeviceVideos);
                    console.log("mediaDeviceVideos", mediaDeviceVideos)
                    //c'è una sola telecamera
                    if (mediaDeviceVideos.length == 1) {
                        setDevice(mediaDeviceVideos[0]);
                    }
                    //ci sono più videocamere
                    if (mediaStream.length > 1) {
                        setDevice(mediaDeviceVideos[0]);
                    }
                    console.log("device", device)

                } else {
                    setMediaDeviceVideos([]);
                }
            }
        ).catch((error) => {
            throw "impossibile accedere alla fotocamera";
        })
    }


    useEffect(() => {
        loadCamera();
    }, [])


    return (
        <>

            <div className="row justify-content-center my-3">
                <div className="card col-md-7 col-sm-10   text-center">
                    <div className="card-body">
                        {!queryString && (
                            <div className="card-title">
                                <h5>Inquadrare il codice QR</h5>
                            </div>
                        )}
                        {error && <div>{error} </div>}
                    </div>
                    <div className="mb-4">

                        {(<div className="text-start"><h1> Funzionalità temporanea di log - new</h1>
                            {isMobile && (<div><p>Dispositivo mobile</p></div>)}
                            {!isMobile && (<div><p>Dispositivo NON mobile</p></div>)}
                            {selected && (<div><p>Tipo di fotocamera: {selected}</p></div>)}
                            {mediaDeviceVideos && mediaDeviceVideos.length <= 0 && (
                                <div><p>Nessuna fotocamera rilevata</p></div>
                            )}
                            {device && (<div><p>Dispositivo in uso: {device.label} - {device.deviceId}</p></div>)}
                            {mediaDeviceVideos && mediaDeviceVideos.length > 0 && (
                                <div>
                                    <p>Elenco fotocamere:</p>
                                    <ul>
                                        {mediaDeviceVideos.map(mediaDeviceVideo => {
                                            return <li
                                                key={mediaDeviceVideo.deviceId}>label:{mediaDeviceVideo.label} -
                                                daviceId:{mediaDeviceVideo.deviceId}</li>
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>)}
                        {device && device?.deviceId && <QrReader
                            onResult={(result, error) => {
                                if (!!result) {
                                    setQueryString(getString(result?.getText()));
                                }

                                if (!!error) {
                                    setError(error.message);
                                }
                            }}
                            containerStyle={{
                                margin: "auto",
                                width: "50%",
                                border: "3px solid black",
                                padding: "10px",
                                backgroundColor: "grey"
                            }}
                            videoContainerStyle={{
                                margin: "auto",
                                width: "95%",
                                border: "2px solid red"
                            }}
                            /*constraints={{deviceId: {exact: device.deviceId}}}*/
                            constraints={{facingMode: {exact: selected}}}
                        />}
                    </div>
                    {queryString && (
                        <div className="card-footer">

                            <p className="fs-5">Stringa alfanumerica letta dal codice QR: </p>
                            <p className="fs-4 ">{queryString}</p>

                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default QRCodeReader;
