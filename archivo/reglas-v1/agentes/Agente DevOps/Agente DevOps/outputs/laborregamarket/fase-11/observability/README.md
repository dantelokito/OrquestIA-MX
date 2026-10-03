# Observabilidad F11 (notas de deploy)

Sin stack Prometheus/Grafana nuevo. Cookies first-party:

| Cookie | Uso |
|--------|-----|
| JWT | `sub` + `role` |
| `lbm_active_provider` | Sucursal activa |

Flags: HttpOnly, Path `/`, SameSite=Lax, Secure solo HTTPS. Sin env Must nueva. Media: `UPLOADS_DIR`.
