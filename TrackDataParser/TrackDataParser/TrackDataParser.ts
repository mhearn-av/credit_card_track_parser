
interface ITrackData {
    startSentinel: string;
    primaryAccountNumber: string;
    fieldSeparator: string;
    expirationDate: string;
    serviceCode: string;
    discretionaryData: string;
    endSentinel: string;
}

interface ITrack1FormatB extends ITrackData {
    name: string;
    formatCode: string;
}

class TrackData implements ITrackData {
    startSentinel: string;  
    primaryAccountNumber: string;
    fieldSeparator: string;
    expirationDate: string;
    serviceCode: string;
    discretionaryData: string;
    endSentinel: string;
    rawTrackData: string;
    trackRegex: RegExp;
}


class Track1FormatB extends TrackData implements ITrack1FormatB{
    // Example of Track1FormatB %B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?
    // http://en.wikipedia.org/wiki/Magnetic_stripe_card
    trackRegex = new RegExp("(%)(B)([0-9]{1,19})(\\^)([^\\^]{2,26})\\^([0-9]{4}|\\^)([0-9]{3}|\\^)([^\\?]+)(\\?)");
    formatCode: string;
    name: string;

    constructor(rawTrackData: string) {
        super();
        this.rawTrackData = rawTrackData;
        if (this.hasValidTrack1FormatB()) {
            this.setTrackData();
        }
        
    }

    hasValidTrack1FormatB(): boolean {
        
        return this.trackRegex.test(this.rawTrackData);

    }

    getParsedTrackDataArray(): RegExpExecArray {
        return this.trackRegex.exec(this.rawTrackData);
        
    }

    setTrackData() {
        var trackData: RegExpExecArray = this.getParsedTrackDataArray();
        trackData.shift();
        this.startSentinel = trackData[0];
        this.formatCode = trackData[1];
        this.primaryAccountNumber = trackData[2];
        this.fieldSeparator = trackData[3];
        this.name = trackData[4];
        this.expirationDate = trackData[5];
        this.serviceCode = trackData[6];
        this.discretionaryData = trackData[7];
        this.endSentinel = trackData[8];

    }
}

class Track2 extends TrackData{
    // http://en.wikipedia.org/wiki/Magnetic_stripe_card
    //Example of track 2 %B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?\n;5266092201416174=16042010000056700100?
    trackRegex = new RegExp("(;)([0-9]{1,19})(=)([0-9]{1,4}|=)([0-9]{1,3}|=)([0-9]*)(\\?)");

    constructor(rawTrackData: string) {
        super();
        this.rawTrackData = rawTrackData;
        if (this.hasValidTrack2()) {
            this.setTrackData();
        }

    }

    getParsedTrackDataArray() {
        return this.trackRegex.exec(this.rawTrackData);  
    }

    setTrackData() {
        var trackData: RegExpExecArray = this.getParsedTrackDataArray();
        trackData.shift();
        this.startSentinel = trackData[0];
        this.primaryAccountNumber = trackData[1];
        this.fieldSeparator = trackData[2];
        this.expirationDate = trackData[3];
        this.serviceCode = trackData[4];
        this.discretionaryData = trackData[5];
        this.endSentinel = trackData[6];

    }

    hasValidTrack2(): boolean {
        return this.trackRegex.test(this.rawTrackData);
    }
}

class ParsedTrackData {
    HasValidTrack1: boolean;
    HasValidTrack2: boolean;
    ParsedTrack1FormatB: ITrack1FormatB;
    ParsedTrack2: ITrackData;

    constructor(parsedTrack1: Track1FormatB, parsedTrack2: Track2) {
        this.ParsedTrack2 = parsedTrack2;
        this.ParsedTrack1FormatB = parsedTrack1;
    }    
}

class TrackDataParser
{
    hasValidTrack1: boolean;
    hasValidTrack2: boolean;
    ParsedTrack1FormatB: Track1FormatB;
    ParsedTrack2: Track2;
    ParsedTrackData: ParsedTrackData;

    Parse(rawTrackData: string): ParsedTrackData {
        this.ParsedTrack2 = new Track2(rawTrackData);
        this.hasValidTrack2 = this.ParsedTrack2.hasValidTrack2();
        this.ParsedTrack1FormatB = new Track1FormatB(rawTrackData);
        this.hasValidTrack1 = this.ParsedTrack1FormatB.hasValidTrack1FormatB();
        this.ParsedTrackData = new ParsedTrackData(this.ParsedTrack1FormatB, this.ParsedTrack2);
        this.ParsedTrackData.HasValidTrack1 = this.hasValidTrack1;
        this.ParsedTrackData.HasValidTrack2 = this.hasValidTrack2;

        return this.ParsedTrackData;
    }
}
