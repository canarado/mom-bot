module.exports = (client, error) => {
    if(client.user.id == '625849096816820234' && error.port == 42069) return
    
    console.error(error)
}