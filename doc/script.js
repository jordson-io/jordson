( async() => {
    let fetchRes = await fetch('/getdata');
    let data = await fetchRes.json();
    console.log(data.docsData);
})();