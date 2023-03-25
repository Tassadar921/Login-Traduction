import sys
import random
import math

def generate_keypair():
    p, q = generate_large_primes(32)
    # Vérifier que les deux nombres sont premiers
    if not (is_prime(p) and is_prime(q)):
        raise ValueError("Les nombres doivent être premiers.")
    elif p == q:
        raise ValueError("Les nombres ne peuvent pas être identiques.")

    # Calculer n = p * q
    n = p * q

    # Calculer la fonction d'Euler φ(n) = (p-1)(q-1)
    phi = (p - 1) * (q - 1)

    # Choisir un entier e tel que 1 < e < φ(n) et e soit premier avec φ(n)
    e = random.randrange(1, phi)
    gcd = math.gcd(e, phi)
    while gcd != 1:
        e = random.randrange(1, phi)
        gcd = math.gcd(e, phi)

    # Utiliser l'algorithme d'Euclide étendu pour calculer d, tel que e * d ≡ 1 (mod φ(n))
    d = mod_inverse(e, phi)

    # Retourner la paire de clés (clé publique, clé privée)
    return [[e, n], [d, n]]

def generate_large_primes(keySize):
    # Choisir deux nombres premiers aléatoires de taille keysize bits
    p = random_prime(keySize)
    q = random_prime(keySize)

    # S'assurer que les deux nombres sont différents
    while p == q:
        q = random_prime(keySize)

    # Retourner la paire de nombres premiers
    return (p, q)

def random_prime(keySize):
    # Choisir un nombre aléatoire de taille keysize bits
    num = random.getrandbits(keySize)

    # S'assurer que le nombre est impair et est de taille keysize bits
    num |= (1 << keySize - 1) | 1

    # Vérifier que le nombre est premier
    while not is_prime(num):
        num += 2

    return num

def is_prime(n):
    if n <= 1:
        return False
    elif n <= 3:
        return True
    elif n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def mod_inverse(a, m):
    # Utiliser l'algorithme d'Euclide étendu pour calculer l'inverse modulaire de a mod m
    if math.gcd(a, m) != 1:
        return None
    u1, u2, u3 = 1, 0, a
    v1, v2, v3 = 0, 1, m
    while v3 != 0:
        q = u3 // v3
        v1, v2, v3, u1, u2, u3 = (
            u1 - q * v1,
            u2 - q * v2,
            u3 - q * v3,
            v1,
            v2,
            v3,
        )
    return u1 % m

print(generate_keypair())
sys.stdout.flush()