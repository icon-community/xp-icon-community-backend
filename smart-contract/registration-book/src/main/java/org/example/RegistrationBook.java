package org.example;

import score.Address;
import score.Context;
import score.DictDB;
import score.VarDB;
import score.annotation.EventLog;
import score.annotation.External;
import score.annotation.Optional;

public class RegistrationBook
{
    /**
     *
     */
    private final DictDB<Address, Long> book = Context.newDictDB("book", Long.class);

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
     * @param _user the address of the user to check
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
    public long getUserRegistrationBlock(Address user) {
        return book.get(user);
    }

    /**
     * Registers a user in the registration book.
     *
     * @param user The address of the user to register.
     */
    @External
    public void registerUser(Address user) {
        long block = Context.getBlockHeight();
        book.set(user, block);
        UserRegistered(user, block);

    }

    @EventLog(indexed=2)
    public void UserRegistered(Address user, long block) {}
}
