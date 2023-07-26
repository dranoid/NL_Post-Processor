function getUserPosts(username) {
  // Find all the posts in the content container
  const posts = document.querySelectorAll('table[summary="posts"] tr');
  //   const posts = document.querySelectorAll('table[summary="posts"]')

  // Filter and get posts authored by the specified user
  const trArr = Array.from(posts);
  const userPosts = [];
  trArr.forEach((td, index) => {
    const authorElement = td.querySelector("a.user");
    // const authorElement = post.querySelector("td.l.pu a.user");
    if (authorElement && authorElement.textContent.trim() == username) {
      console.log(authorElement.textContent.trim(), "authorr");
      const hasQuote = !!trArr[index + 1].querySelector(
        "div.narrow blockquote"
      );
      const userPost = {
        header: td,
        content: trArr[index + 1],
        isQuote: hasQuote,
      };

      userPosts.push(userPost);
    }
    return false;
  });

  // Now you have an array of user's posts (userPosts)
  // You can do whatever you want with this array

  if (userPosts.length === 0) {
    console.log(`No posts found for user "${username}"`);
  } else {
    // Or manipulate the posts, for example, display their content in the console
    userPosts.forEach((userPost) => {
      //   console.log(userPost.content.innerHTML.trim());
      userPost.meta = processPostMetaData(userPost.content);
      userPost.header = extractAuthorAndDate(userPost.header);
      userPost.content = cleanUpContent(userPost.content);
    });
    console.log(userPosts, "this is user post");
  }
}

// Call the function with the username you want to find
getUserPosts("CuriousStudent"); // Replace 'CuriousStudent' with the desired username
getUserPosts("Bvlgari"); // Replace 'CuriousStudent' with the desired username

function processPostMetaData(post) {
  const metaDataElement = post.querySelector("p.s");
  const metaDataText = metaDataElement.textContent;

  // Regular expressions to extract the number of likes and shares
  const likesRegex = /(\d+)\s+Likes/;
  const sharesRegex = /(\d+)\s+Share/;

  const likesMatch = metaDataText.match(likesRegex);
  const sharesMatch = metaDataText.match(sharesRegex);

  const likes = likesMatch ? parseInt(likesMatch[1]) : 0;
  const shares = sharesMatch ? parseInt(sharesMatch[1]) : 0;

  // Extract all the quotes if available
  const narrowElement = post.querySelector("div.narrow");
  const blockquoteElements = narrowElement.querySelectorAll("blockquote");
  const quotes = [];

  blockquoteElements.forEach((blockquoteElement) => {
    const quoteAuthor = blockquoteElement.querySelector("a").textContent;
    const quoteContent = blockquoteElement.textContent
      .replace(`${quoteAuthor}:`, "")
      .trim();

    quotes.push({
      author: quoteAuthor,
      content: quoteContent,
    });
  });

  // Create the meta object with all the extracted data
  const meta = {
    likes,
    shares,
    quoted: quotes.length > 0 ? quotes : {},
  };

  return meta;
}

function extractAuthorAndDate(headerTd) {
  const headerText = headerTd.textContent.trim();

  // Extract the author and date using regular expressions
  const authorRegex = /by\s+(.+):\s/;
  const dateRegex = /On\s+(\w+\s+\d{1,2},\s+\d{4})/;

  const authorMatch = headerText.match(authorRegex);
  const dateMatch = headerText.match(dateRegex);

  const author = authorMatch ? authorMatch[1] : "";
  const date = dateMatch ? dateMatch[1] : "";

  return { author, date };
}

function cleanUpContent(contentTd) {
  // Clone the contentTd to avoid modifying the original element
  const contentClone = contentTd.cloneNode(true);

  // Remove all blockquote elements from the cloned content
  const blockquoteElements = contentClone.querySelectorAll("blockquote");
  blockquoteElements.forEach((blockquoteElement) => {
    blockquoteElement.parentNode.removeChild(blockquoteElement);
  });

  // Remove unnecessary text content
  const unwantedText =
    /\(Quote\)|\(Report\)|\d+ Likes?|\(Like\)|\d+ Share(?:s?)|\(Share\)/g;
  contentClone.textContent = contentClone.textContent.replace(unwantedText, "");

  // Return the text content of the modified cloned content
  return contentClone.textContent.trim();
}
