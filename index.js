addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  console.log("Received: "+request.headers.get('Cookie'));
  cookieParam = []
  if (request.headers.get('Cookie') != null){
    cookieParam = request.headers.get('Cookie');
    console.log("Stuff Inside: "+request.headers.get('Cookie'))
    cookieParam = cookieParam.substring(cookieParam.indexOf("variant="),cookieParam.indexOf("*"))
    console.log("Cutted from *: "+cookieParam)
    cookieParam = cookieParam.split("|")
    console.log("Resulting Array: "+String(cookieParam));
  }
  ans = await fetch("https://cfw-takehome.developers.workers.dev/api/variants")
  data = await ans.json();
  link = data.variants
  if (cookieParam.length == 3){
    i = parseInt(cookieParam[0].substring(cookieParam[0].indexOf("=")+1))
    console.log("Index "+String(i))
    v = link[i]
    console.log("Had Index")
  }
  else{
    i = (Math.floor(Math.random() * (10)))%2
    console.log(i);
    v = link[i]
    console.log("Did not have an Index")
  }
  w = await fetch(String(v));
  w = await w.text();
  /*Background Change*/
  w = changeBackround(w,cookieParam);
  color = w[1]
  num = w[2]
  w = w[0]
  /*******************/
  /* Change titles of Text Box and the Title of the Website*/
  w = changeText(w);
  /****************************/
  console.log("Sent: "+"variant="+String(i%2)+"|color="+String(color)+""+"|num="+String(num))
  console.log("---------------------------------")
  r =  new Response((w),{headers:{'content-type':'text/html'},})
  r.headers.set("Set-Cookie", "variant="+String(i%2)+"|color="+String(color)+""+"|num="+String(num)+"*")
  return r
}
function changeBackround(w,cookieParam){
  colors = ['gray','red','yellow','green','blue','indigo','pink','orange','teal']
  num = ['1','2','3','4','5','6','7','8','9']
  color_place = w.indexOf("gray-500")
  if (!(cookieParam.length == 3)){
    i = (Math.floor(Math.random() * (colors.length)))
    j = (Math.floor(Math.random() * (num.length)))
    w = w.substring(0,color_place)+colors[i]+"-"+num[j]+"00 "+w.substring(color_place+"gray-500".length+1,w.length)
    return [w,colors[i],num[j]+'00']
  }
  else{
    color = cookieParam[1].substring(cookieParam[1].indexOf("=")+1)
    num = cookieParam[2].substring(cookieParam[2].indexOf("=")+1)
    console.log("Had color: "+color+" "+num)
    w = w.substring(0,color_place)+color+"-"+num+" "+w.substring(color_place+"gray-500".length+1,w.length)
    return [w,color,num]
  }
}

function changeText(w){
  content = [
    ['Architecture','https://www.youtube.com/watch?v=JLhbTGzE6MA'],
    ['Ludovico','https://www.youtube.com/watch?v=X1DRDcGlSsE'],
    ['Enya','https://www.youtube.com/watch?v=g4w4aKsWzkI'],
    ['Graffiti 6','https://www.youtube.com/watch?v=9iaU3WAOACo'],
    ['Beatles','https://www.youtube.com/watch?v=2Q_ZzBGPdqE'],
    ['Computer Science','https://www.youtube.com/watch?v=SzJ46YA_RaA']
  ]
  variant_index = w.indexOf("Variant ")
  w = w.substring(0,variant_index) +"Random Video Selector Version" + w.substring(variant_index+"Variant".length,w.length)
  variant_index = w.indexOf("Variant")
  w = w.substring(0,variant_index)+"Choose a video with Selector (Variant"+w.substring(variant_index+"Variant".length,variant_index+"Variant".length+2)+")"+w.substring(variant_index+"Variant".length+2,w.length)
  selection = (Math.floor(Math.random() * (content.length)))
  selection = content[selection]
  title_1_index = w.indexOf("This is variant ");
  title_2_index = w.indexOf("home project!")+"home project!".length;
  w = w.substring(0,title_1_index)+"Let's listen to something by:"+w.substring(title_2_index,w.length)
  link_index = w.indexOf("https://cloudflare.com")
  w = w.substring(0,link_index)+selection[1]+w.substring(link_index+"https://cloudflare.com".length+1,w.length)
  button_text_index = w.indexOf("Return to cloudflare.com")
  w = w.substring(0,button_text_index)+selection[0]+"! "+w.substring(button_text_index+"Return to cloudflare.com".length+1,w.length)
  // console.log(w);
  return w;
}
