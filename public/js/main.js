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

            // this is an optimistic parse. a real app might have to incrementally build a string up until it's useful
            // in this example, for time, i've made sure the /stream endpoint returns a valid row of JSON each time
            return JSON.parse(item);
          })

          rows.map(createListItem);

          return pump(); // recursively `pump` the stream until done comes back.
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
