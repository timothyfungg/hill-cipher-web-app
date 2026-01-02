class HillCipher:
    def __init__(self, key): # key in the form of row matrix [[a, b], [c, d]]
        self.key = key
        self.invertedKey = self.invertKey()
    
    @classmethod
    def charToInt(cls, char):
        return (ord(char.capitalize()) - 65)
    
    @classmethod
    def intToChar(cls, int):
        alphabet = {
            0: "A",
            1: "B",
            2: "C",
            3: "D",
            4: "E",
            5: "F",
            6: "G",
            7: "H",
            8: "I",
            9: "J",
            10: "K",
            11: "L",
            12: "M",
            13: "N",
            14: "O",
            15: "P",
            16: "Q",
            17: "R",
            18: "S",
            19: "T",
            20: "U",
            21: "V",
            22: "W",
            23: "X",
            24: "Y",
            25: "Z"
        }
        return alphabet[int]
    
    @classmethod
    def groupInts(cls, ints): # integer list
        # adds dummy integer if odd number of letters
        if((len(ints) % 2) != 0):
            ints.append(0)
        
        pairs = []
        for i in range(0, len(ints), 2):
            pairs.append([ints[i], ints[i + 1]])
        
        return pairs # pairs in the form of [[a_1, a_2], [a_3, a_4], . . .], where each list is a column vector
    
    @classmethod
    def pairsToString(cls, pairs):
        output = ""
        for i in range(0, len(pairs)):
            output += HillCipher.intToChar(pairs[i][0]) + HillCipher.intToChar(pairs[i][1])
        return output

    def invertKey(self):
        det = self.key[0][0] * self.key[1][1] - self.key[0][1] * self.key[1][0]
        mod26 = { # inverse mod 26 for all possible 2x2 determinants
            1: 1,
            3: 9,
            5: 21,
            7: 15,
            9: 3,
            11: 19,
            15: 7,
            17: 23,
            19: 11,
            21: 5,
            23: 17,
            25: 25
        }
        try:
            detMod26Inverse = mod26[det]
        except KeyError:
            raise Exception("Invalid key (no inverse)")
        
        # create 2x2 adjoint matrix in mod 26 [[d % 26, -b % 26], [-c % 26, a % 26]]
        adjKey = [[self.key[1][1] % 26, (- self.key[0][1]) % 26], [(- self.key[1][0]) % 26, self.key[0][0] % 26]]
        # multiply adjoint by inverse of determinant in mod 26, then mod 26 the matrix elements
        invertedKey = [[(adjKey[0][0] * detMod26Inverse) % 26, (adjKey[0][1] * detMod26Inverse) % 26], [(adjKey[1][0] * detMod26Inverse) % 26, (adjKey[1][1] * detMod26Inverse) % 26]]
        return invertedKey
    
    def transform(self, text, matrix):
        ints = []
        for i in range(0, len(text)):
            ints.append(HillCipher.charToInt(text[i]))
        
        pairs = HillCipher.groupInts(ints)
        transformedPairs = []
        for i in range(0, len(pairs)):
            transformedPairs.append([])

        # matrix multiply key * pairs[i]
        for i in range(0, len(pairs)):
            transformedPairs[i].append(((matrix[0][0] * pairs[i][0]) + (matrix[0][1] * pairs[i][1])) % 26)
            transformedPairs[i].append(((matrix[1][0] * pairs[i][0]) + (matrix[1][1] * pairs[i][1])) % 26)

        return transformedPairs
    
    def encrypt(self, text):
        return self.transform(text, self.key)

    def decrypt(self, text):
        return self.transform(text, self.invertedKey)