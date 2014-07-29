///<reference path="../typings/qunit.d.ts"/>
///<reference path="../TrackDataParser.ts"/>

/*
Tracks for testing
%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?
%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?\n;5266092201416174=16042010000056700100?
%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?;5266092201416174=16042010000056700100?
%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?;5266092201416174==2010000056700100?
%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?;5266092201416174===0000056700100?
*/


test("hasValidTrack1 true", function() {
    var trackData: Track1FormatB = new Track1FormatB("%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?");
    equal(true, trackData.hasValidTrack1FormatB(), "hasValidTrack1FormatB: " + trackData.hasValidTrack1FormatB());
});

test("getParsedTrackDataArray Track1FormatB match", function() {
    var trackData: Track1FormatB = new Track1FormatB("%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?");
    var track1FormatBArray: RegExpExecArray = trackData.getParsedTrackDataArray();
    ok(track1FormatBArray != null);
});

//how to handle formats aside from B?
test("getParsedTrackDataArray Track1FormatB unsupported format", function () {
    var trackData: Track1FormatB = new Track1FormatB("%C5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?");
    var track1FormatBArray: RegExpExecArray = trackData.getParsedTrackDataArray();
    ok(track1FormatBArray == null);
});

test("getParsedTrackDataArray Track1FormatB no match missing starting sentinel", function () {
    var trackData: Track1FormatB = new Track1FormatB("B15266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?");
    var track1FormatBArray: RegExpExecArray = trackData.getParsedTrackDataArray();
    ok(track1FormatBArray == null);
});

test("getParsedTrackDataArray Track2 match", function () {
    var trackData: Track1FormatB = new Track1FormatB("%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?\n;5266092201416174=16042010000056700100?");
    var track1FormatBArray: RegExpExecArray = trackData.getParsedTrackDataArray();
    ok(track1FormatBArray != null);
});

test("getParsedTrackDataArray Track2 no match missing starting sentinel", function () {
    var trackData: Track2 = new Track2("%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?\n5266092201416174=16042010000056700100?");
    var track1FormatBArray: RegExpExecArray = trackData.getParsedTrackDataArray();
    ok(track1FormatBArray == null);
});

test("hasValidTrack2 true", function () {
    var trackData: Track2 = new Track2("%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?\n;5266092201416174=16042010000056700100?");
    equal(true, trackData.hasValidTrack2(), "hasValidTrack2: " + trackData.hasValidTrack2());
});

test("setTrackData Track1FormatB valid no missing information", function() {
    var trackData: Track1FormatB = new Track1FormatB("%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?\n;5266092201416174=16042010000056700100?");
    ok(trackData.startSentinel == "%", "startSentinel");
    ok(trackData.formatCode == "B", "formatCode");
    ok(trackData.primaryAccountNumber == "5266092201416174", "primaryAccountNumber");
    ok(trackData.fieldSeparator == "^", "fieldSeparator");
    ok(trackData.name == "FATEHI/SUALEH", "name");
    ok(trackData.expirationDate == "1604", "expiration date");
    ok(trackData.serviceCode == "201", "service code");
    ok(trackData.discretionaryData == "0000000000000000000000000000567001000", "discretionary data: " + trackData.discretionaryData);
    ok(trackData.endSentinel == "?", "endSentinel: " + trackData.endSentinel);
});

test("setTrackData Track1FormatB valid missing information", function () {
    var trackData: Track1FormatB = new Track1FormatB("%B5266092201416174^FATEHI/SUALEH^^^0000000000000000000000000000567001000?\n;5266092201416174=16042010000056700100?");
    ok(trackData.startSentinel == "%", "startSentinel");
    ok(trackData.formatCode == "B", "formatCode");
    ok(trackData.primaryAccountNumber == "5266092201416174", "primaryAccountNumber");
    ok(trackData.fieldSeparator == "^", "fieldSeparator");
    ok(trackData.name == "FATEHI/SUALEH", "name");
    ok(trackData.expirationDate == "^", "expiration date");
    ok(trackData.serviceCode == "^", "service code");
    ok(trackData.discretionaryData == "0000000000000000000000000000567001000", "discretionary data: " + trackData.discretionaryData);
    ok(trackData.endSentinel == "?", "endSentinel: " + trackData.endSentinel);
});

test("setTrackData Track 2 valid no missing information", function () {
    var trackData: Track2 = new Track2("%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?\n;5266092201416174=16042010000056700100?");
    ok(trackData.startSentinel == ";");
    ok(trackData.primaryAccountNumber == "5266092201416174");
    ok(trackData.fieldSeparator == "=", "fieldSeparator");
    ok(trackData.expirationDate == "1604");
    ok(trackData.serviceCode == "201");
    ok(trackData.discretionaryData == "0000056700100");
    ok(trackData.endSentinel == "?");
});

test("setTrackData Track 2 valid missing information", function () {
    var trackData: Track2 = new Track2("%B5266092201416174^FATEHI/SUALEH^16042010000000000000000000000000000567001000?\n;5266092201416174===0000056700100?");
    ok(trackData.startSentinel == ";", "startSentinel");
    ok(trackData.primaryAccountNumber == "5266092201416174", "primary account number");
    ok(trackData.fieldSeparator == "=", "fieldSeparator");
    ok(trackData.expirationDate == "=", "expiration date");
    ok(trackData.serviceCode == "=", "service code");
    ok(trackData.discretionaryData == "0000056700100", "discretionary data");
    ok(trackData.endSentinel == "?", "endSentinel");
});

