'use strict';

let expect = require('chai').expect;
let fs = require("fs");
let parse_georaster = require("../src/georaster.js");
let parse_metadata = require("../src/parse_metadata.js");
let parse_iso = parse_metadata.parse_iso;


describe('Parsing Rasters', function() {
  describe('Parsing OSGEO Samples', function() {
    it('should parse data/GeogToWGS84GeoKey5.tif', function(done) {
        this.timeout(50000);
        fs.readFile("data/GeogToWGS84GeoKey5.tif", (error, data) => {
            parse_georaster(data).then(georaster => {
                try {
                    expect(georaster.number_of_rasters).to.equal(1);
                    expect(georaster.projection).to.equal(32767);
                    expect(georaster.values[0]).to.have.lengthOf(georaster.height);
                    expect(georaster.values[0][0]).to.have.lengthOf(georaster.width);
                    done();
                } catch (error) {
                    console.error("error:", error);
                }
            });
        });
    });
  });
});

describe('Checking Error Catching', function() {
  describe('if you pass in undefined', function() {
    it('should throw an error', function() {
        try {
            parse_georaster(undefined);
        } catch (error) {
            let actual_error_message = error.toString();
            let expected_error_message = 'Error: [Georaster.parse_georaster] Error. You passed in undefined to parse_georaster. We can\'t make a raster out of nothing!';
            expect(actual_error_message).to.equal(expected_error_message);
        }
    });
  });
});


describe('Parsing Metadata', function() {
  describe('if you pass in iso xml text', function() {
    it('should parse metadata', function(done) {
        fs.readFile("data/iso.xml", "utf8", (error, data) => {
            let parsed = parse_iso(data);
            expect(parsed.projection).to.equal(4326);
            expect(parsed.xmin).to.equal(10.2822923743907);
            expect(parsed.xmax).to.equal(13.3486486092171);
            expect(parsed.ymin).to.equal(44.418521542726054);
            expect(parsed.ymax).to.equal(47.15260827566466);
            done();
        });
    });
  });
});

/*
    Using tiff created from
    http://geomap.arpa.veneto.it/geoserver/wcs?crs=EPSG%3A4326&service=WCS&format=GeoTIFF&request=GetCoverage&height=329&width=368&version=1.0.0&BBox=9.679858245722988%2C13.951082737884812%2C44.183855724634675%2C47.38727409375604&Coverage=geonode%3Aatlanteil
*/
describe('Parsing Regular Tiff Files', function() {
  describe('if you pass in tiff from geoserver with metadata', function() {
    it('should parse correctly', function(done) {
        fs.readFile("data/geonode_atlanteil.tif", (error, data) => {
            parse_georaster(data, null, true).then(parsed => {
                expect(parsed.projection).to.equal(4326);
                expect(parsed.xmin).to.equal(10.2822923743907);
                expect(parsed.xmax).to.equal(13.3486486092171);
                expect(parsed.ymin).to.equal(47.15260827566466);
                expect(parsed.ymax).to.equal(49.88669500860327);
                done();                
            });
        });
    });
  });
});