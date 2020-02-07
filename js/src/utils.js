
export async function fetchInfo(server, dataset) {
  if (!server.startsWith('http'))
    server = `http://${server}`;

  const response = await fetch(`${server}/mod_visus?action=readdataset&dataset=${dataset}`);
  const data = await response.text();
  return parseInfo(data);
}

function parseInfo(str) {
    let o = {times: [], fields:[]}, values;

    console.log('parseInfo:', str);
    let lines = str.split('\n');
    for (let i=0; i<lines.length; i++) {
      let line = lines[i];

      switch (line) {
        case '(box)':
          values = lines[++i].split(' ');
          o.dims = {x: parseInt(values[1]) + 1, y: parseInt(values[3]) + 1};
          if (values.length > 5)
            o.dims.z = parseInt(values[5]) + 1;
          break;
        case '(bits)':
          o.bitmask = lines[++i];
          o.nbits = o.bitmask.length - 1;
          break;
        case ('(logic_to_physic)'):
          o.logic_to_physic = lines[++i].split(' ').map(s => parseFloat(s));
          break;
        case ('bitsperblock'):
          o.bitsperblock = parseInt(lines[++i]);
          break;
        case ('(fields)'):
          // o.fields = [];
          while ((line = lines[++i]) && line[0] !== '(') {
            values = line.split(' ');
            let name = values[0] !== '+' ? values[0] : values[1];
            o.fields.push(name);
          }
          i--;
          break;
        case ('(time)'):
          values = lines[++i].split(' ');
          o.times = [parseInt(values[0]), parseInt(values[1])];
          break;
      }
    }

    return o;
  }