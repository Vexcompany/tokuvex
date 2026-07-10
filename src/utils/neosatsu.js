const PROXY = "https://cors.siputzx.my.id/"
const PLACEHOLDER = "https://placehold.co/180x260/0e0f1a/5a5c7a?text=No+Poster"

async function fetchDoc(url) {
  // 1. Ubah ke res.text() karena siputzx mengembalikan HTML mentah, bukan JSON
  const res = await fetch(PROXY + encodeURIComponent(url))
  const htmlText = await res.text() 
  
  const parser = new DOMParser()
  // 2. data.contents diganti langsung ke htmlText
  return parser.parseFromString(htmlText, "text/html") 
}

export async function fetchEpisodes(urlNeosatsu) {
  try {
    const doc = await fetchDoc(urlNeosatsu)
    const area = doc.querySelector(".post-body") || doc.querySelector("#main") || doc.body
    const links = area.querySelectorAll("a")
    const episodes = []

    links.forEach(a => {
      const href = a.href
      const label = a.innerText.trim()
      if (href.includes("linkuzu.blogspot.com") && href.includes("?url=")) {
        try {
          let enc = href.split("?url=")[1].split("=")[0] + "="
          if (enc.length > 12) {
            enc = enc.substring(enc.indexOf("=") - 11, enc.indexOf("=") + 1).match(/[A-Za-z0-9+/]+={0,2}/)[0]
          }
          const id = atob(enc).replace(/[^A-Za-z0-9]/g, "")
          if (id && id.length >= 6) {
            episodes.push({
              episode: label || `Eps ${episodes.length + 1}`,
              id_file: id,
              url_embed: `https://pixeldrain.com/api/file/${id}?display=video`,
              url_download: `https://pixeldrain.com/api/file/${id}`,
            })
          }
        } catch {}
      }
    })
    return episodes
  } catch {
    return []
  }
}

export async function fetchPoster(urlNeosatsu) {
  try {
    const doc = await fetchDoc(urlNeosatsu)
    const area = doc.querySelector(".post-body") || doc.querySelector("#main") || doc.body
    const img = area.querySelector("img")
    if (img?.src) return img.src
    return PLACEHOLDER
  } catch {
    return PLACEHOLDER
  }
}
