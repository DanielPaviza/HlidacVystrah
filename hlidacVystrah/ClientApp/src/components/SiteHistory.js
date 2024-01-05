
class SiteHistory {

    constructor(navigateHome) {
        this.history = [];
        this.navigateHome = navigateHome;
    }

    AddRecord = (OpenFunction, id, isRegion) => {

        let newRecord = { openFunction: OpenFunction, id: id, isRegion: isRegion };

        if(newRecord != this.history[this.history.length-1])
            this.history.push(newRecord);
    }

    NavigateBack = () => {

        if (this.history.length <= 1) {
            this.navigateHome();
            this.history = [];
            return;
        }
            
        this.history.pop();
        let lastSite = this.history.pop();
        lastSite.isRegion ? lastSite.openFunction(lastSite.id, lastSite.isRegion) : lastSite.openFunction(lastSite.id);
    }
}

export default SiteHistory;