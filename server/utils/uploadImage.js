async function uploadImage(base64image) {
  /* This function should upload base64image to imgbb, and return
  a string that is the display url from imgbb API */

  /* Apparently imgbb API can recognize copyrighted images/files 
  or something like that (probably from metadata of the file?) 
  If you get status code 400, error 'You have been forbidden to use this website', code 103,
  probably the image you're trying to upload is copyrighted. 
  P/S: Got said error from trying to upload images from unsplash. No known workaround.
  Just upload something else. */

  try {
    /* Data prefixes (e.g "data:image/jpeg;base64,") should be removed
    as imgbb API doesn't recognize them (as of 2023) */
    const base64Data = base64image.replace("data:image/jpeg;base64,", "");

    // "image" as the name of the key is REQUIRED by imgbb API
    const formData = new FormData();
    formData.append("image", base64Data);

    // Headers unnecessary; POST preferred over GET per imgbb API guide
    return fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "post",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => data.data.display_url);
  } catch (err) {
    console.log(err);
  }
}

module.exports = uploadImage;
