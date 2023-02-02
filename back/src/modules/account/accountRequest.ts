module accountRequest {
    // console.log(await connection.querySingle(");
    console.log(await connection.query("SELECT User {username, email, password}"));
    // console.log(await connection.query("INSERT User {username := 'test', email := 'coucou@coucou', password := '123'}"));
    console.log('finito');    
}