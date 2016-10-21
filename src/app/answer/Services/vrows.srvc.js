(function () {
    'use strict';

    angular
        .module('app')
        .factory('vrows', vrows);

    vrows.$inject = ['$http', '$q', '$rootScope', 'vrowvotes'];

    function vrows($http, $q, $rootScope, vrowvotes) {

        // Members
        var _allvrows = [];
        var baseURI = '/api/v2/mysql/_table/vrows';

        var service = {
            getAllvrows: getAllvrows,
            postRec: postRec,
            postRec2: postRec2,
            deleteVrowByAnswer: deleteVrowByAnswer,
            deleteVrow: deleteVrow,
            updateRec: updateRec,
            deleteVrowByGroup: deleteVrowByGroup,
            postVrows4Answer: postVrows4Answer
        };

        return service;

        function getAllvrows(forceRefresh) {

            if (_areAllvrowsLoaded() && !forceRefresh) {

                return $q.when(_allvrows);
            }
            
            //Get all vrows records
            var url0 = baseURI + '?offset=' + 0 * 1000;
            var url1 = baseURI + '?offset=' + 1 * 1000;
            var url2 = baseURI + '?offset=' + 2 * 1000;
            var url3 = baseURI + '?offset=' + 3 * 1000;
            var url4 = baseURI + '?offset=' + 4 * 1000;
            var url5 = baseURI + '?offset=' + 5 * 1000;

            var p0 = $http.get(url0);
            var p1 = $http.get(url1);
            var p2 = $http.get(url2);
            var p3 = $http.get(url3);
            var p4 = $http.get(url4);
            var p5 = $http.get(url5);

            return $q.all([p0, p1, p2, p3, p4, p5]).then(function (d) {
                _allvrows = d[0].data.resource.concat(d[1].data.resource, d[2].data.resource, d[3].data.resource,
                    d[4].data.resource, d[5].data.resource);
                if ($rootScope.DEBUG_MODE) console.log("No. Vrows: ", _allvrows.length);
                return _allvrows;
            }, _queryFailed);

        }

        function postVrows4Answer(answer) {
            var titles = [];
            var obj = {};
            var vrowsobjs = [];
            if ($rootScope.cCategory.tags.includes('food') || $rootScope.cCategory.tags.includes('services') ||
                $rootScope.cCategory.tags.includes('health') || $rootScope.cCategory.tags.includes('beauty') ||
                $rootScope.cCategory.tags.includes('food') || $rootScope.cCategory.title.includes('food') ||
                $rootScope.cCategory.title.includes('restaurants') ||
                $rootScope.cCategory.title.includes('Bars') || $rootScope.cCategory.title.includes('bars') ||
                $rootScope.cCategory.title.includes('pubs') ||
                $rootScope.cCategory.title.includes('Yoga') || $rootScope.cCategory.title.includes('Pilates') ||
                $rootScope.cCategory.title.includes('yoga') || $rootScope.cCategory.title.includes('pilates') ||
                $rootScope.cCategory.title.includes('schools') ||
                $rootScope.cCategory.title.includes('Gyms') || $rootScope.cCategory.title.includes('gyms') ||
                $rootScope.cCategory.title.includes('Nightclubs') || answer.type == 'PersonCust' ||
                answer.type == 'Establishment') {

                titles = ['Quality of Service', 'Friendliness of Staff', 'Promptness of Service', 'Value for the Money'];

                if ($rootScope.cCategory.tags.includes('food') || $rootScope.cCategory.title.includes('food') ||
                    $rootScope.cCategory.title.includes('restaurants')) {
                    titles = ['Quality of Food and Drinks', 'Friendliness of Staff', 'Promptness of Service', 'Value for the Money'];
                }
                if ($rootScope.cCategory.title.includes('Bars') || $rootScope.cCategory.title.includes('bars') ||
                    $rootScope.cCategory.title.includes('pubs')) {
                    titles = ['Quality of Drinks', 'Friendliness of Staff', 'Promptness of Service', 'Value for the Money'];
                }

                if ($rootScope.cCategory.title.includes('Yoga') || $rootScope.cCategory.title.includes('Pilates') ||
                    $rootScope.cCategory.title.includes('yoga') || $rootScope.cCategory.title.includes('pilates') ||
                    $rootScope.cCategory.title.includes('schools')) {
                    titles = ['Quality of Instructors', 'Friendliness of Staff', 'Class Environment', 'Value for the Money'];
                }
                if ($rootScope.cCategory.title.includes('Gyms') || $rootScope.cCategory.title.includes('gyms')) {
                    titles = ['Equipment & Facilities', 'Friendliness of Staff', 'Environment', 'Value for the Money'];
                }
                if ($rootScope.cCategory.title.includes('Nightclubs')) {
                    titles = [' Quality of Music', 'Environment', 'Friendliness of Staff', 'Value for the Money'];
                }
                if (answer.type == 'PersonCust') {
                    titles = [' Quality of Service', 'Friendliness', 'Value for the Money'];
                }
                //else if ($rootScope.cCategory.tags.includes('services')){
                            
                //}
                for (var n = 0; n < titles.length; n++) {
                    obj = {};
                    obj.gnum = 1;
                    obj.gtitle = 'General';
                    obj.title = titles[n];
                    obj.upV = 0;
                    obj.downV = 0;
                    //obj.timestmp = Date.now();
                    obj.answer = answer.id;
                    vrowsobjs.push(obj);
                    //vrows.postRec(obj);                           
                }
                postRec2(vrowsobjs);
            }

        }

        function postRec(x) {
           
            //form match record
            var data = x;
            data.upV = 0;
            data.downV = 0;
            data.timestmp = Date.now();

            var obj = {};
            obj.resource = [];

            obj.resource.push(data);

            var url = baseURI;

            return $http.post(url, obj, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: obj
            }).then(querySucceeded, _queryFailed);
            function querySucceeded(result) {
                
                //update local copy
                var newVRow = data;
                newVRow.id = result.data.resource[0].id;
                _allvrows.push(newVRow);
                //$rootScope.cvrows.push(newVRow);

                return result.data;

            }
        }

        function postRec2(x) {

            var obj = {};
            obj.resource = [];

            obj.resource.push(x);
            
            //update local copy
            _allvrows.push.apply(_allvrows, x);

            var url = baseURI;

            return $http.post(url, x, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: obj
            }).then(querySucceeded, _queryFailed);
            function querySucceeded(result) {
                
                //update local copy
                var eidx = _allvrows.length - 1;
                for (var n = result.data.resource.length - 1; n >= 0; n--) {
                    _allvrows[eidx].id = result.data.resource[n].id;
                    eidx--;
                }

                return result.data;

            }
        }
        function deleteVrowByAnswer(answer_id) {
            
            //delete records from local copy
            for (var i = 0; i < _allvrows.length; i++) {
                if (_allvrows[i].answer == answer_id) {
                    _allvrows.splice(i, 1);
                }
            }

            var url = baseURI + '?filter=answer=' + answer_id;

            return $http.delete(url).then(querySucceeded, _queryFailed);

            function querySucceeded(result) {
                
                //Everytime a Vrow record is deleted, delete associated user votes with it
                for (var i = 0; i < result.data.resource.length; i++) {
                    vrowvotes.deleteVrowVotesbyVrow(result.data.resource[i].id);
                }

                if ($rootScope.DEBUG_MODE) console.log("Deleting vrows records for answer was succesful");
                return result.data;
            }
        }

        function deleteVrowByGroup(gnum) {
            
            //delete records from local copy
            for (var i = _allvrows.length - 1; i >= 0; i--) {
                if (_allvrows[i].gnum == gnum) {
                    _allvrows.splice(i, 1);
                }
            }

            var url = baseURI + '?filter=gnum=' + gnum;

            return $http.delete(url).then(querySucceeded, _queryFailed);

            function querySucceeded(result) {
                
                //Everytime a Vrow record is deleted, delete associated user votes with it
                for (var i = 0; i < result.data.resource.length; i++) {
                    vrowvotes.deleteVrowVotesbyVrow(result.data.resource[i].id);
                }

                if ($rootScope.DEBUG_MODE) console.log("Deleting vrows records for group was succesful");
                return result.data;
            }
        }

        function deleteVrow(vrow_id) {
            
            //form match record
            var obj = {};
            obj.resource = [];

            var data = {};
            data.id = vrow_id;

            obj.resource.push(data);

            var url = baseURI + '/' + vrow_id;
            
            //update (delete answer) local copy of answers
            var i = _allvrows.map(function (x) { return x.id; }).indexOf(vrow_id);
            if (i > -1) _allvrows.splice(i, 1);

            return $http.delete(url, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: obj
            }).then(querySucceeded, _queryFailed);
            function querySucceeded(result) {
                
                //Everytime a Vrow record is deleted, delete associated user votes with it
                for (var i = 0; i < result.data.resource.length; i++) {
                    vrowvotes.deleteVrowVotesbyVrow(result.data.resource[i].id);
                }

                if ($rootScope.DEBUG_MODE) console.log("Deleting vrow was succesful");
                return result.data;
            }
        }

        function updateRec(rec_id, field, val) {
             
            //form match record
            var obj = {};
            obj.resource = [];

            var data = {};
            data.id = rec_id;

            for (var i = 0; i < field.length; i++) {
                switch (field[i]) {
                    case "upV": data.upV = val[i]; break;
                    case "downV": data.downV = val[i]; break;
                    case "title": data.title = val[i]; break;
                    case "gnum": data.gnum = val[i]; break;
                    case "gtitle": data.gtitle = val[i]; break;
                }
            }
            //console.log("data", data);
            obj.resource.push(data);

            var url = baseURI;
            
            //update local copy
            var idx = _allvrows.map(function (x) { return x.id; }).indexOf(rec_id);
            for (var i = 0; i < field.length; i++) {
                switch (field[i]) {
                    case "upV": $rootScope.cvrows[idx].upV = val[i]; break;
                    case "downV": $rootScope.cvrows[idx].downV = val[i]; break;
                    case "title": $rootScope.cvrows[idx].title = val[i]; break;
                    case "gnum": $rootScope.cvrows[idx].gnum = val[i]; break;
                    case "gtitle": $rootScope.cvrows[idx].gtitle = val[i]; break;
                }
            }

            return $http.patch(url, obj, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: obj
            }).then(querySucceeded, _queryFailed);
            function querySucceeded(result) {

                if ($rootScope.DEBUG_MODE) console.log("updating vrows record succesful");
                return result.data;
            }
        }

        function _areAllvrowsLoaded() {

            return _allvrows.length > 0;
        }

        function _queryFailed(error) {

            throw error;
        }
    }
})();