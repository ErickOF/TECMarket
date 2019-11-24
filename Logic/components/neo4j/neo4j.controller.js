const neo4j = require('neo4j-driver').v1;
const Store = require('../store/store.dao');
const User = require('../auth/auth.dao');

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'pato123')
)

exports.migrateData = (req, res, next) => {
    /* Neo4j*/
    Store.find((err, resp) => {
        if (err) return res.status(500).send(err);
        if (!resp) {
            res.send({
                message: 'Id Store does not exists'
            });
        } else {
            var session = driver.session()
            var query = 'CREATE '
            for (let i = 0; i < resp.length; i++) {
                query = query + `(store${i.toString()}:Store{name:'${resp[i]['name']}', id_store:'${resp[i]['id_store']}', description:'${resp[i]['description']}', address:'${resp[i]['address']}'})`
                if (i != resp.length - 1) {
                    query = query + ", "
                }
            }
            session.run(query).subscribe({
                onNext: function (record) {
                    //console.log(record.get('name'))
                    console.log('test')
                },
                onCompleted: function (data) {
                    console.log(data)
                    session.close()
                    migrateDataAux(res)
                },
                onError: function (error) {
                    console.log(error)
                    res.send(error)
                }
            })
        }
    });
}

function migrateDataAux(res) {
    User.find({ id_rol: 3 }, (err, resp) => {
        if (err) return res.status(500).send(err);
        if (!resp) {
            res.send({
                message: 'Clients empty'
            });
        } else {
            console.log(resp)
            var session = driver.session()
            var query = 'CREATE '
            for (let i = 0; i < resp.length; i++) {
                query = query + `(user:Client{name:'${resp[i]['name']}', user_id:'${resp[i]['user_id']}', username:'${resp[i]['username']}', email:'${resp[i]['email']}'})`
                if (i != resp.length - 1) {
                    query = query + ", "
                }
            }
            session.run(query).subscribe({
                onNext: function (record) {
                },
                onCompleted: function (data) {
                    session.close()
                    migrateDataAux2(res)
                },
                onError: function (error) {
                    console.log(error)
                    res.send(error)
                }
            })
        }
    });
}

function migrateDataAux2(res){

}