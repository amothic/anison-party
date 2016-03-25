mkdir metadata
shairport -a "anison-party" -M metadata -o pipe /dev/stdout | node anison.js
