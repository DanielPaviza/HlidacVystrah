import { Last } from "../../../../node_modules/react-bootstrap/esm/PageItem";

class SiteHistory {

    constructor(closeDetails) {
        this.history = [];
        this.closeDetails = closeDetails;
    }

    AddRecord = (OpenFunction, id, isRegion) => {

        let newRecord = { openFunction: OpenFunction, id: id, isRegion: isRegion };
        if (this.RecordCanAdd(newRecord))
            this.history.push(newRecord);
    }

    RecordCanAdd = (newRecord) => {

        if (this.history.length < 1)
            return true

        return !(newRecord.id == this.RecordGetLast().id);
    }

    AddHomeRecord = (OpenFunction) => {

        let newRecord = { openFunction: OpenFunction, id: null, isRegion: null };
        if (this.RecordCanAdd(newRecord))
            this.history.push(newRecord);
    }

    RecordGetLast = () => {

        if (this.history.length < 1)
            return { openFunction: null, id: null, isRegion: null };

        return this.history[this.history.length - 1];
    }

    // returns bool true if current page is home
    NavigateBack = () => {

        if (this.history.length <= 1) {
            this.history = [];
            this.closeDetails();
            return true;
        }
            
        this.history.pop();
        let lastSite = this.history.pop();

        // is home
        if (lastSite.id == null && lastSite.isRegion == null) {
            lastSite.openFunction();
            return true;
        }

        lastSite.isRegion ? lastSite.openFunction(lastSite.id, lastSite.isRegion) : lastSite.openFunction(lastSite.id);

        return false;
    }
}

export default SiteHistory;