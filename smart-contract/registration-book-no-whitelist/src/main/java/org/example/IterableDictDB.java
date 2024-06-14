package org.example;

import score.Context;
import score.DictDB;
import scorex.util.ArrayList;

import java.util.List;

public class IterableDictDB<K, V> {

    private static final String NAME = "_ITERABLE_DICTDB";

    private final DictDB<K, V> values;
    private final SetDB<K> keys;


    public IterableDictDB(String key, Class<V> valueType, Class<K> keyType, Boolean order) {
        this.keys = new SetDB<>(key + NAME + "_keys", keyType, order);
        this.values = Context.newDictDB(key + NAME + "_values", valueType);
    }

    public int size() {
        return keys.size();
    }

    public List<K> keys() {
        int size = this.keys.size();
        List<K> keyList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            keyList.add(this.keys.get(i));
        }
        return keyList;
    }

    public void set(K key, V value) {
        this.keys.add(key);
        this.values.set(key, value);
    }

    public void remove(K key) {
        this.keys.remove(key);
        this.values.set(key, null);
    }

    public V get(K key) {
        return this.values.get(key);
    }

    public K getKey(int i) {
        return this.keys.get(i);
    }

    public V getOrDefault(K key, V defaultValue) {
        return this.values.getOrDefault(key, defaultValue);
    }
}
