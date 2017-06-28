# lava
Lava is JavaScript that sizzles™ 😉

## Operators

| Operator & Name | `itemA`&nbsp;`#oper` | `#oper`&nbsp;`itemB` | `itemA`&nbsp;`#oper`&nbsp;`itemB` |
| --------------- | ------------- | ------------- | ------------------- |
| `=`   With key value  | *Not supported* | *Not supported*                    | `x = 1` replaces state with x equal to 1 |
| `!`   Without key     | *Not supported* | `! x` replaces state without key x | *Not supported* |
| `>>`  Reference state | `currentState >>` replaces state with `currentState` referencing prior state, and containing itself in `currentState` | `>> currentState` replaces state with `currentState` referencing prior state | *Not supported* |
| `<<`  Restore state   | *Not supported* | `<< currentState` replaces state with stored `currentState` | *Not supported* |
| `>>>` Capture state | `currentState >>>` replaces state with blank state containing `currentState`, and containing itself in `currentState` | `>>> currentState` replaces state with `currentState` | *Not supported* |
