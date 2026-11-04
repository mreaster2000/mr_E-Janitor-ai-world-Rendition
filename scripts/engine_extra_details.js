/* Expanded, standalone-compatible ES5 runtime. Build with extra_details/build.py. */
(function () {
  if (typeof context === 'undefined' || !context || !context.chat || !context.character) return;
  var C = EXTRA_DETAILS_CONFIG;
  function text(s) { return typeof s === 'string' ? s : ''; }
  function norm(s) {
    return ' ' + text(s).toLowerCase()
      .replace(/[àáâäãå]/g, 'a').replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i').replace(/[òóôöõ]/g, 'o')
      .replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c').replace(/œ/g, 'oe')
      .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '') + ' ';
  }
  function matches(hay, keys) {
    for (var i = 0; keys && i < keys.length; i++) {
      if (text(keys[i]).replace(/\s/g, '') && hay.indexOf(norm(keys[i])) !== -1) return true;
    }
    return false;
  }
  var message = text(context.chat.last_message) || text(context.chat.lastMessage);
  var hay = norm(message), selected = [], groups = {}, parts = [], used = 0, i, e;
  var boundary = matches(hay, C.boundaryKeys) || hay === ' stop ' || hay === ' no ';
  var distress = matches(hay, C.distressKeys);
  for (i = 0; i < C.entries.length; i++) {
    e = C.entries[i];
    if (e.id === 'boundary') {
      if (boundary) selected.push({entry: e, order: i});
      continue;
    }
    if (e.id === 'distress') {
      if (distress) selected.push({entry: e, order: i});
      continue;
    }
    if ((boundary || distress) && e.tone === 'romance') continue;
    if (!matches(hay, e.keys) || matches(hay, e.block)) continue;
    selected.push({entry: e, order: i});
  }
  selected.sort(function (a, b) {
    return (b.entry.priority || 0) - (a.entry.priority || 0) || a.order - b.order;
  });
  for (i = 0; i < selected.length && parts.length < C.maxEntries; i++) {
    e = selected[i].entry;
    var group = '$' + (e.group || e.id), value = text(e.text);
    if (groups[group] || !value || used + value.length + 1 > C.maxOptionalChars) continue;
    groups[group] = true;
    parts.push(value);
    used += value.length + 1;
  }
  var start = '\n[EXTRA_DETAILS:' + C.slug + ']\n';
  var end = '\n[/EXTRA_DETAILS:' + C.slug + ']';
  var scenario = text(context.character.scenario), at = scenario.indexOf(start), close;
  while (at !== -1) {
    close = scenario.indexOf(end, at + start.length);
    if (close === -1) break;
    scenario = scenario.slice(0, at) + scenario.slice(close + end.length);
    at = scenario.indexOf(start);
  }
  var output = C.direction;
  if (parts.length) output += '\n\nRelevant possibilities, not established events:\n' + parts.join('\n\n');
  context.character.scenario = scenario + start + output + end;
})();
