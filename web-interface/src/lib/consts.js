export const timers_gql_request = `
query {
  transactions(
    address_friendly: "Ef8gIwUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASB6"
    page_size: 50
    page: 0
  ) {
    in_msg_src_addr_workchain_id
    in_msg_src_addr_address_hex
    in_msg_value_grams
    gen_utime
  }
}
`;

export const timer_code = 'te6ccgECCAEAAroAART/APSkE/S88sgLAQPk0wHQ0wMBcbCPZiHHAJJfA49dAdMfAYIQJOXxyrqPTAH6QDAB0x/UMO1E0PQE0z8BIlFCQxRHZts8FL7y4IxujoSIcPsA3oIQF9eEAHCAEMjLBVADzxYB+gLLiotkJvdW50eYzxbJcPsA7VSSXwPi4uMNAgcDAfbtRCT4I6EBggGGoPlBMFiAEvgz+Cj6RDABgCD0DG+hMIAo1yHTPwOoAtM/MFADqKABqKsPcFM1vI4SMDWCCC3GwFFCoRSoIRA1UEQDkTTiAqof+CWCEDuAAAGpCLFUQReAQPQ38uCqVBBDAsj0ABLLPwHPFskC+COhUiAEAexfA/gA7UTQ9ATTPwEC+CMhgED0h2+lnFMTArOSW3CTqx++4o4TAXD7AFiAQPRbMCCAQPSHb6UQNOhfAyBujiIwMXBwgBDIywVQA88WAfoCy4qLZCb3VudHmM8WyYEAoPsAjpICAsj0ABLLPwHPFsntVIhw+wDiBwGKAYIBhqD5QTBYgBL4M/go+kQwAYAg9AxvoTCAKNch0z8DqALTPzBQA6igAairD1ADoYIQBfXhAAGCEBfXhACgUAOgWKACBQHccAHQ0wABntMAAcAB8uBk+kAx+kAxjkcx0wIBc7Dy0G76QI0IZ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDL6QFnHBfLQb/oA9AQBbvLgcPoAMfoAMeKAYNch0wAB4wDTADAwEqAGAJzTAAGOJdQB0NMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMTCOIdMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMeIAaGJ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgJiWgAAAAAAAAAAAAAAAAAAA=';

export const tc2_manifest_url = 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'