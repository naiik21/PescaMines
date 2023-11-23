# PescaMines
## Funcionament
Hi ha un taulell de caselles iguals. Al polsar sobre una casella:
* Si hi ha una mina → es mostren totes les mines del taulell i un alert de que has perdut.
* Si no hi ha mina → es mostra el número de mines totals adjacents a la casella polsada
  ** Si el número de mines adjacents és 0, s’han d’obrir totes les caselles adjacents que també
tinguin com a valor 0

El joc acaba quan s’han descobert totes les caselles que no tenen mina → s’ha guanyat la partida,
o quan es clica sobre una que tingui mina → s’ha perdut la partida
