# Next Steps

1. Añadir pruebas de integración HTTP para autenticación, permisos y CRUD financiero.
2. Añadir filtros por fecha y exportación de reportes.
3. Retirar componentes heredados después de confirmar que no existan referencias externas.

1. Ampliar pruebas automáticas para autenticación, permisos de superusuario y CRUD financiero.

1. Permitir ajustar la fecha y los meses restantes de los créditos para que las proyecciones de amortización reflejen cambios contractuales.

1. Generar una tabla de amortización futura por crédito a partir de su saldo y cuota actuales.

1. Mostrar el historial de cuotas de cada crédito y una tabla de amortización completa.

1. Añadir registro de pagos hipotecarios y tabla de amortización mensual; el módulo actual calcula la cuota y su primera distribución de interés/capital.

1. DiseÃ±ar una migraciÃ³n opcional para guardar la categorÃ­a de las metas en una columna separada, si se requiere filtrarla o reportarla.

1. Reemplazar los botones de retorno restantes por navegación React y extraer componentes de página reutilizables.
2. Conectar el Dashboard web a `GET /dashboard/summary` para centralizar los cálculos.
2. Resolver las advertencias `react-hooks/exhaustive-deps` en los managers activos.
2. Añadir validaciones coherentes a Income y Profile; sus contratos de respuesta ya fueron declarados.
3. Mejorar los formularios de edición para reemplazar prompts por controles visuales y permitir editar todos los campos descriptivos.
4. Reemplazar gráficos de ejemplo por series históricas reales; hoy el gráfico de patrimonio solo muestra el valor actual.
5. Añadir pruebas automatizadas para routers, servicios y frontend.
6. Corregir textos con codificación defectuosa y tipos monetarios `Float`; agregar configuración de logging por entorno si se necesita depuración.
7. Definir y documentar formalmente métricas de Emergency Fund, Financial Freedom y AI Advisor antes de ampliar esas funciones.
