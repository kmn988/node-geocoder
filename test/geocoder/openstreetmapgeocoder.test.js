(function () {
  var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    sinon = require('sinon');

  var OpenStreetMapGeocoder = require('../../lib/geocoder/openstreetmapgeocoder.js');

  var mockedHttpAdapter = {
    get: function () {}
  };

  describe('OpenStreetMapGeocoder', () => {
    describe('#constructor', () => {
      test('an http adapter must be set', () => {
        expect(function () {
          new OpenStreetMapGeocoder();
        }).to.throw(Error, 'OpenStreetMapGeocoder need an httpAdapter');
      });

      test('Should be an instance of OpenStreetMapGeocoder', () => {
        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

        osmAdapter.should.be.instanceof(OpenStreetMapGeocoder);
      });
    });

    describe('#geocode', () => {
      test('Should not accept IPv4', () => {
        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

        expect(function () {
          osmAdapter.geocode('127.0.0.1');
        }).to.throw(
          Error,
          'OpenStreetMapGeocoder does not support geocoding IPv4'
        );
      });

      test('Should not accept IPv6', () => {
        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

        expect(function () {
          osmAdapter.geocode('2001:0db8:0000:85a3:0000:0000:ac1f:8001');
        }).to.throw(
          Error,
          'OpenStreetMapGeocoder does not support geocoding IPv6'
        );
      });

      test('Should call httpAdapter get method', () => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .returns({ then: function () {} });

        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

        osmAdapter.geocode('1 champs élysée Paris');

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

        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

        osmAdapter.geocode('12 Ngô Quyền, Hà Nội', function (err, results) {
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

          results.raw.should.deep.equal([
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

          mock.verify();
          done();
        });
      });

      test('Should return geocoded address when quried with object', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .callsArgWith(2, false, [
            {
              place_id: '207513245',
              licence:
                'Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright',
              osm_type: 'way',
              osm_id: '864632964',
              boundingbox: [
                '21.0083722',
                '21.0089518',
                '105.7978958',
                '105.7985570'
              ],
              lat: '21.0086146',
              lon: '105.79827453624539',
              display_name:
                'Cục Tần số Vô tuyến Điện, 115, Đường Trần Duy Hưng, Phường Trung Hòa, Cau Giay District, Hà Nội, 10055, Vietnam',
              type: 'government',
              importance: 0.00007283054856179167,
              address: {
                house_number: '115',
                province: 'Hà Nội',
                street: 'Đường Trần Duy Hưng',
                quarter: 'Trung Hòa',
                city: 'Hà Nội',
                suburb: 'Cầu Giấy',
                country: 'Vietnam',
                postcode: '10055',
                country_code: 'vn'
              }
            }
          ])
          .withArgs('http://nominatim.openstreetmap.org/search', {
            format: 'json',
            addressdetails: 1,
            city: 'Hà Nội',
            limit: 1,
            street: '115 Đường Trần Duy Hưng'
          });

        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);

        osmAdapter.geocode(
          { street: '115 Đường Trần Duy Hưng', city: 'Hà Nội', limit: 1 },
          function (err, results) {
            mock.verify();

            err.should.to.equal(false);

            results[0].should.to.deep.equal({
              latitude: 21.0086146,
              longitude: 105.79827453624539,
              formattedAddress:
                'Cục Tần số Vô tuyến Điện, 115, Đường Trần Duy Hưng, Phường Trung Hòa, Cau Giay District, Hà Nội, 10055, Vietnam',
              country: 'Vietnam',
              province: 'Hà Nội',
              suburb: 'Cầu Giấy',
              quarter: 'Trung Hòa',
              city: 'Hà Nội',
              zipcode: '10055',
              streetName: 'Đường Trần Duy Hưng',
              streetNumber: '115',
              countryCode: 'VN'
            });

            done();
          }
        );
      });

      test('Should ignore format and addressdetails arguments', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .callsArgWith(2, false, [])
          .withArgs('http://nominatim.openstreetmap.org/search', {
            format: 'json',
            addressdetails: 1,
            q: 'Athens'
          });

        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);
        osmAdapter.geocode(
          { q: 'Athens', format: 'xml', addressdetails: 0 },
          function (err, results) {
            mock.verify();
            done();
          }
        );
      });
    });

    describe('#reverse', () => {
      test('Should return geocoded address', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
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
        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);
        osmAdapter.reverse(
          { lat: 21.0609975, lon: 105.7779905120694 },
          function (err, results) {
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
            results.raw.should.deep.equal({
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

            mock.verify();
            done();
          }
        );
      });

      test('Should correctly set extra arguments', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .callsArgWith(2, false, [])
          .withArgs('http://nominatim.openstreetmap.org/reverse', {
            format: 'json',
            addressdetails: 1,
            lat: 12,
            lon: 7,
            zoom: 15
          });

        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);
        osmAdapter.reverse(
          { lat: 12, lon: 7, zoom: 15 },
          function (err, results) {
            mock.verify();
            done();
          }
        );
      });

      test('Should correctly set extra arguments from constructor extras', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .callsArgWith(2, false, [])
          .withArgs('http://nominatim.openstreetmap.org/reverse', {
            format: 'json',
            addressdetails: 1,
            lat: 12,
            lon: 7,
            zoom: 9
          });

        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter, {
          zoom: 9
        });
        osmAdapter.reverse({ lat: 12, lon: 7 }, function (err, results) {
          mock.verify();
          done();
        });
      });

      test('Should ignore format and addressdetails arguments', done => {
        var mock = sinon.mock(mockedHttpAdapter);
        mock
          .expects('get')
          .once()
          .callsArgWith(2, false, [])
          .withArgs('http://nominatim.openstreetmap.org/reverse', {
            format: 'json',
            addressdetails: 1,
            lat: 12,
            lon: 7
          });

        var osmAdapter = new OpenStreetMapGeocoder(mockedHttpAdapter);
        osmAdapter.reverse(
          { lat: 12, lon: 7, format: 'xml', addressdetails: 0 },
          function (err, results) {
            mock.verify();
            done();
          }
        );
      });
    });
  });
})();
