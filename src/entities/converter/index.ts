import { makeAutoObservable } from "mobx";

class ConverterStor {
    isLoading: boolean = false;
    refFileName: string | null = null;
    loadingTime: number[] = [0, 0];
    isMessageShow: boolean = false;
    href: string = "";
    doc: any = null;

    constructor() {
        makeAutoObservable(this);
    }


    setLoadingTime = (val: number[]) => this.loadingTime = val;
    setIsMessageShow = (val: boolean) => this.isMessageShow = val;
    setRefFileName = (val: string | null) => this.refFileName = val;
    setIsLoading = (val: boolean) => this.isLoading = val;

    setHref = (doc: any) => {

        const file = new Blob([doc as unknown as string], { type: 'application/dxf' });
        const url = URL.createObjectURL(file);

        this.href = url;
    }

    setDoc = (doc: any) => {
        this.doc = doc;
        this.setHref(doc);
    }
}

export const store = new ConverterStor();
