import type { INumber } from "../../../common/types/numbers";
import type { IRootState } from "../../../redux/types";

export interface Props {
    busy: boolean;
    onPage: number;
    list: INumber[];
    store: IRootState;
    actions: any;
    enableSorting?: boolean;
}

export interface State {
    indexes: string[];
}
