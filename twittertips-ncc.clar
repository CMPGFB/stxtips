;; Generated by NoCodeClarity
;; AI Preaudited

;; Define a variable to store the tip bot address, initialized to the contract deployer.
(define-data-var tip-bot-address principal tx-sender)

;; Public function to set a new tip bot address, only callable by the current tip bot address.
(define-public (set-tip-bot-address (new-address principal))
  (begin
    ;; Assert that the sender is the current tip bot address.
    (asserts! (is-eq tx-sender (var-get tip-bot-address)) (err u100))
    ;; Update the tip bot address.
    (ok (var-set tip-bot-address new-address))))

;; Public function to tip STX to a recipient, only callable by the tip bot address.
(define-public (tip-stx (recipient principal) (amount uint))
  (begin
    ;; Assert that the sender is the current tip bot address.
    (asserts! (is-eq tx-sender (var-get tip-bot-address)) (err u101))
    ;; Transfer the specified amount of STX to the recipient.
    (stx-transfer? amount tx-sender recipient)))

;; Public function to tip a fungible token to a recipient, only callable by the tip bot address.
(define-public (tip-token (token <ft-trait>) (recipient principal) (amount uint))
  (begin
    ;; Assert that the sender is the current tip bot address.
    (asserts! (is-eq tx-sender (var-get tip-bot-address)) (err u101))
    ;; Transfer the specified amount of tokens to the recipient.
    (contract-call? token transfer amount tx-sender recipient none)))
