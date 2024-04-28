package org.example;

import score.Address;
import score.Context;
import score.annotation.EventLog;
import score.annotation.External;
// import scorex.util.HashMap;

import java.util.Map;
import java.util.HashMap;
import java.math.BigInteger;
import java.util.List;

public class RegistrationBook
{
    /**
     *
     */
    private static final String BOOK_STRING = "book";
    private static final IterableDictDB<Address, BigInteger> book = new IterableDictDB<>(BOOK_STRING, BigInteger.class, Address.class, false);

    /**
     * The RegistrationBook class represents a book for managing registrations.
     * It provides methods for adding, and retrieving registrations.
     */
    /**
     * Constructs a new RegistrationBook object.
     * This constructor is intentionally left empty.
     */
    public RegistrationBook() {
    }

    /**
     * Checks if a user is registered in the registration book.
     *
     * @param user the address of the user to check
     * @return "true" if the user is registered, "false" otherwise
     */
    @External(readonly=true)
    public String isUserRegistered(Address user) {
        return book.get(user) != null ? "true" : "false";
    }

    /**
        * Retrieves the registration block of a user.
        *
        * @param user the address of the user
        * @return the registration block as an integer
        */
    @External(readonly=true)
    public BigInteger getUserRegistrationBlock(Address user) {
        return book.get(user);
    }

    @External(readonly=true)
    public int getNumberOfUsers() {
        return book.size();
    }

    @External(readonly=true)
    public List<Address> getUsersList() {
        return book.keys();
    }

    // @External(readonly=true)
    // public Map<String, BigInteger> getUsers() {
    //     Map<String, BigInteger> bookMap = new HashMap<>();
    //     for (Address address : book.keys()) {
    //         bookMap.put(address.toString(), book.getOrDefault(address, BigInteger.ZERO));
    //     }
    //     return bookMap;
    // }

    /**
     * Registers a user in the registration book.
     *
     * @param user The address of the user to register.
     */
    @External
    public void registerUser(Address user) {
        Address caller = Context.getCaller();
        if (caller.equals(user) || caller.equals(Context.getOwner())) {
            long block = Context.getBlockHeight();
            BigInteger blockBigInt = BigInteger.valueOf(block);
            book.set(user, blockBigInt);
            UserRegistered(user, blockBigInt);
        } else {
            Context.revert("Only the owner or the user can register the user.");
        }
    }

    @EventLog(indexed=2)
    public void UserRegistered(Address user, BigInteger block) {}
}
