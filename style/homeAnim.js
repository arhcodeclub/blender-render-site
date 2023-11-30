function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
  
async function countdown() {
    const element = document.getElementById("counter");
    element.innerHTML = "5";
    await delay(1000);
    element.innerHTML = "4";
    await delay(1000);
    element.innerHTML = "3";
    await delay(1000);
    element.innerHTML = "2";
    await delay(1000);
    element.innerHTML = "1";
    await delay(1000);
}
  
countdown();

