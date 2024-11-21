import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useRef } from "react";
import { DxfWriter } from "@tarikjabiri/dxf";
import { setData } from "@/modules/insert/setData";
import { getSplines } from "@/modules/create/getSplines";

const UploadForm = observer(() => {

    const {
        store: { isLoading, refFileName, setIsMessageShow, setIsLoading, setLoadingTime, setRefFileName, setDoc },
    } = ConverterStor;

    const refTime = useRef([0, 0]);

    const readFile = (evt: ChangeEvent<HTMLInputElement>) => {

        if (!evt.target.files) return;

        if (evt.target.files[0].name.split(".").at(-1) !== "mooe") {
            setIsMessageShow(true);
            return
        };

        setIsLoading(true);

        const file = evt.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);

        setRefFileName(file.name);

        reader.onload = async () => {

            const interval = setInterval(() => {

                if (refTime.current[1] === 59) {
                    setLoadingTime([refTime.current[0] + 1, 0]);
                    refTime.current[0] += 1;
                    refTime.current[1] = 0;
                }
                else {
                    setLoadingTime([refTime.current[0], refTime.current[1] + 1]);
                    refTime.current[1] += 1;
                }

            }, 1000);

            try {
                const dxf = new DxfWriter();

                const fileStr = reader.result as string;

                const mooeJson = JSON.parse(fileStr);

                const newDXF = setData(dxf, mooeJson);

                const splines = getSplines(mooeJson, newDXF);

                const dxfString = newDXF.stringify();

                const targetStr = dxfString.replace("ENTITIES\n0", `${splines}`);

                setDoc(targetStr);

                setIsLoading(false);

                clearInterval(interval);

            } catch (err: any) {
                return console.error(err.stack);
            }

        };

        reader.onerror = () => {
            console.error(reader.error);
        };

    }

    const restFiles = (evt: FormEvent<HTMLFormElement>) => {
        setIsMessageShow(false);
        evt.currentTarget.reset();
        setRefFileName(null);
        setLoadingTime([0, 0]);
    }


    return <>
        <form onClick={isLoading ? evt => evt.preventDefault() : restFiles}>
            <label htmlFor="file-upload" className={isLoading ? "disabledUpload custom-file-upload" : "custom-file-upload"}>
                {refFileName ? refFileName : "Выберите файл .mooe"}
            </label>
            <input id="file-upload" type="file" onChange={isLoading ? evt => evt.preventDefault() : readFile} />
        </form>
    </>
});

export default UploadForm;