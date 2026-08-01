## До индексов

| Запрос                       | Тип скана | Execution Time |
| ---------------------------- | --------- | -------------- |
| WHERE status = 'scheduled'   | Seq Scan  | 0.128 ms       |
| WHERE origin = 'SVO'         | Seq Scan  | 0.114 ms       |
| WHERE departure_time BETWEEN | Seq Scan  | 1.727 ms       |
| WHERE origin + status        | Seq Scan  | 0.939 ms       |

## После индексов

| Запрос                       | Тип скана  | Execution Time |
| ---------------------------- | ---------- | -------------- |
| WHERE status = 'scheduled'   | Index Scan | ----- ms       |
| WHERE origin = 'SVO'         | Index Scan | ----- ms       |
| WHERE departure_time BETWEEN | Index Scan | 0.073 ms       |
| WHERE origin + status        | Index Scan | ----- ms       |

