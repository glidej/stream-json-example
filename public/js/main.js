const getRows = async () =>  {
  empty();
  const rows = await fetch('/api/regular').then(async (res) => await res.json())

  rows.map(createListItem);
}

const getStreamingRows = async () =>  {
  empty();
  const decoder = new TextDecoder('utf-8');

  fetch('/api/stream')
    .then(response => response.body)
    .then(body => {
      const reader = body.getReader();

      function pump() {
        return reader.read().then(({ done, value }) => {
          // When no more data needs to be consumed, close the stream
          if (done) {
              return;
          }

          const content = decoder.decode(value).split('\n');
          const rows = content.map((item) => {
            if (item === "") {
              return null
            }

            return JSON.parse(item);
          })

          rows.map(createListItem);

          return pump();
        });
      }

      pump();
    });
}

const createListItem = (content) => {
  if (!content) {
    return;
  }

  const element  = document.getElementById('stuff');
  const fragment = document.createDocumentFragment();
  let li = document.createElement('li');
      li.textContent = `${content.first_name} ${content.last_name}`;

  fragment.appendChild(li);

  element.appendChild(fragment);
}

const empty = () => {
  document.getElementById('stuff').innerHTML = '';
}
