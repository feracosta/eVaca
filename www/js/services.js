angular.module('app.services', [])

.factory('login', function($http,$q){
     return{
          note: function(username,password){
               var deferred = $q.defer();
               $http.post("http://localhost:8420/",{username: username,password: password}).then(successcall,errorcall);
               function successcall(results){
                    // console.log('success');
                    // return true;
                    console.log(results.data);
                    if(results.data == "true"){
                         deferred.resolve(results.data);
                    }else{
                         deferred.resolve(results.data);
                    }

               }
               function errorcall(){
                    deferred.reject(false);
               }
               return deferred.promise;
          }
     }
})

.factory('signUp', function($http,$q){
     return{
          note: function(name,email,password,security,security_answer){
               var deferred = $q.defer();
               $http.post("http://localhost:8420/",{name: name, email: email,password: password, security: security, security_answer: security_answer}).then(successcall,errorcall);
               function successcall(results){
                    // console.log('success');
                    // return true;
                    console.log(results.data);
                    if(results.data == "true"){
                         deferred.resolve(results.data);
                    }else{
                         deferred.reject(results.data);
                    }

               }
               function errorcall(){
                    deferred.reject(false);
               }
               return deferred.promise;
          }
     }
})

.factory('resetpassword',function($http, $q){
     return{
          getEmail: function(email){
          var deferred = $q.defer();
          $http.get("http://localhost:8420/verify",{email:email}).then(successcall,errorcall);
               function successcall(result){
               console.log(result.data);

               if(results.data == "true")
               {
                    deferred.resolve(results.data);;
               }else{
                    deferred.reject(results.data);
               }

          }
     function errorcall(){
          deferred.reject(false);
     }
     return deferred.promise;
     }
}
})

.service('BlankService', [function(){

}]);
