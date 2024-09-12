(function () {
  var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    sinon = require('sinon');

  var NominatimMapquestGeocoder = require('../../lib/geocoder/nominatimmapquestgeocoder.js');

  var mockedHttpAdapter = {
    get: function () {}
  };

  describe('NominatimMapquestGeocoder', () => {
    describe('#constructor', () => {
      test('an http adapter must be set', () => {
        expect(function () {
          new NominatimMapquestGeocoder();
        }).to.throw(Error, 'NominatimMapquestGeocoder need an httpAdapter');
      });

      test('an apiKey must be set', () => {
        expect(function () {
          new NominatimMapquestGeocoder(mockedHttpAdapter);
        }).to.throw(Error, 'NominatimMapquestGeocoder needs an apiKey');
      });

      test('Should be an instance of NominatimMapquestGeocoder', () => {
        var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter, {
          apiKey: 'API_KEY'
        });

        nmAdapter.should.be.instanceof(NominatimMapquestGeocoder);
      });
    });

    describe('#geocode', () => {
      test('Should not accept IPv4', () => {
        var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter, {
          apiKey: 'API_KEY'
        });

        expect(function () {
          nmAdapter.geocode('127.0.0.1');
        }).to.throw(
          Error,
          'NominatimMapquestGeocoder does not support geocoding IPv4'
        );
      });

      test('Should not accept IPv6', () => {
        var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter, {
          apiKey: 'API_KEY'
        });

        expect(function () {
          nmAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
        }).to.throw(
          Error,
          'NominatimMapquestGeocoder does not support geocoding IPv6'
        );
      });

      test('Should call httpAdapter get method', () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .withArgs('http://open.mapquestapi.com/nominatim/v1/search', {
            key: 'API_KEY',
            addressdetails: 1,
            format: 'json',
            q: '1 champs élysée Paris'
          })
          .returns({ then: function () {} });

        var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter, {
          apiKey: 'API_KEY'
        });

        nmAdapter.geocode('1 champs élysée Paris');

        mock.verify();
      });

      test('Should return geocoded address', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .callsArgWith(2, false, [
            {
              place_id: '371408123',
              licence:
                'Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright',
              osm_type: 'way',
              osm_id: '704153616',
              boundingbox: [
                '21.0264368',
                '21.0268920',
                '105.8551375',
                '105.8554352'
              ],
              lat: '21.02666585',
              lon: '105.8552602508254',
              display_name:
                'Tonkin Palace, 12, Ngo Quyen Street, Phường Tràng Tiền, Hoan Kiem District, Hà Nội, 11022, Vietnam',
              type: 'attraction',
              importance: 0.39240155039647573,
              address: {
                house_number: '12',
                street: 'Phố Ngô Quyền',
                suburb: 'Hoàn Kiếm',
                city: 'Hà Nội',
                quarter: 'Tràng Tiền',
                province: 'Hà Nội',
                postcode: '11022',
                country: 'Vietnam',
                country_code: 'vn'
              }
            }
          ]);

        var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter, {
          apiKey: 'API_KEY'
        });

        nmAdapter.geocode('12 Ngô Quyền, Hà Nội', function (err, results) {
          mock.verify();

          err.should.to.equal(false);

          results[0].should.to.deep.equal({
            latitude: 21.02666585,
            longitude: 105.8552602508254,
            formattedAddress:
              'Tonkin Palace, 12, Ngo Quyen Street, Phường Tràng Tiền, Hoan Kiem District, Hà Nội, 11022, Vietnam',
            country: 'Vietnam',
            province: 'Hà Nội',
            city: 'Hà Nội',
            zipcode: '11022',
            streetName: 'Phố Ngô Quyền',
            suburb: 'Hoàn Kiếm',
            quarter: 'Tràng Tiền',
            streetNumber: '12',
            countryCode: 'VN'
          });

          done();
        });
      });
    });

    describe('#reverse', () => {
      test('Should return geocoded address', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .withArgs('http://open.mapquestapi.com/nominatim/v1/reverse', {
            key: 'API_KEY',
            addressdetails: 1,
            format: 'json',
            lat: 21.0609975,
            lon: 105.7779905120694
          })
          .callsArgWith(2, false, {
            place_id: '207725411',
            licence:
              'Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright',
            osm_type: 'way',
            osm_id: '1115559634',
            lat: '21.0609975',
            lon: '105.7779905120694',
            display_name:
              'Sân bóng cổ nhuê, Ngõ 145 Cổ Nhuế, Co Nhue 2 Ward, North Tu Liem District, Hà Nội, 12500, Vietnam',
            address: {
              house_number: '145',
              street: 'Cổ Nhuế',
              suburb: 'Bắc Từ Liêm',
              quarter: 'Cổ Nhuế',
              city: 'Hà Nội',
              postcode: '12500',
              country: 'Vietnam',
              country_code: 'vn'
            }
          });
        var nmAdapter = new NominatimMapquestGeocoder(mockedHttpAdapter, {
          apiKey: 'API_KEY'
        });
        nmAdapter.reverse(
          { lat: 21.0609975, lon: 105.7779905120694 },
          function (err, results) {
            mock.verify();
            err.should.to.equal(false);
            results[0].should.to.deep.equal({
              latitude: 21.0609975,
              longitude: 105.7779905120694,
              formattedAddress:
                'Sân bóng cổ nhuê, Ngõ 145 Cổ Nhuế, Co Nhue 2 Ward, North Tu Liem District, Hà Nội, 12500, Vietnam',
              country: 'Vietnam',
              city: 'Hà Nội',
              province: '',
              suburb: 'Bắc Từ Liêm',
              quarter: 'Cổ Nhuế',
              zipcode: '12500',
              streetName: 'Cổ Nhuế',
              streetNumber: '145',
              countryCode: 'VN'
            });
            done();
          }
        );
      });
    });
  });
})();
